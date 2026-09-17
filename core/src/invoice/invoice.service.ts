import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { createHash } from 'crypto';
import { ClientRepository } from '../db/clientRepository';
import {
  PDF_QUEUE_NAME,
  JOB_TYPE_GENERATE_PDF,
  DEDUP_TTL_SECONDS,
  PDF_QUEUE_MAX_ATTEMPTS,
  PDF_QUEUE_BACKOFF_DELAY_MS,
} from '../config/constants';
import { InvoiceRepository } from 'src/db/invoiceRepository';
import { InvoiceStatus } from 'src/db/types/invoiceStatus';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly invoiceRepository: InvoiceRepository,
    @InjectQueue(PDF_QUEUE_NAME) private readonly pdfQueue: Queue,
    private readonly redis: Redis,
  ) {}

  async createInvoice(email: string, jobs: Record<string, number>) {
    const jobsHash = createHash('md5')
      .update(JSON.stringify(jobs))
      .digest('hex');
    const dedupKey = `invoice-dedup:${email}:${jobsHash}`;

    const isNew = await this.redis.set(
      dedupKey,
      '1',
      'EX',
      DEDUP_TTL_SECONDS,
      'NX',
    );

    if (!isNew) {
      const existing = await this.invoiceRepository.findOneByEmailAndJobs(
        email,
        jobs,
      );
      if (existing) {
        return { id: existing.key, duplicate: true };
      }
    }

    const clientFromDb = await this.clientRepository.getOne(email);
    if (clientFromDb === null) throw new NotFoundException('Client not found');

    const { firstName, lastName, companyEmail, companyName } = clientFromDb;
    const invoiceFromDb = await this.invoiceRepository.createInvoice({
      email,
      jobs,
    });

    const jobsArray = Object.entries(jobs).map(([name, amount]) => ({
      name,
      amount,
    }));

    const total = Object.values(jobs).reduce((sum, amt) => sum + amt, 0);

    const invoiceDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    await this.pdfQueue.add(
      JOB_TYPE_GENERATE_PDF,
      {
        invoiceId: invoiceFromDb.id,
        firstName,
        lastName,
        email,
        companyEmail,
        companyName,
        jobs: jobsArray,
        total,
        invoiceDate,
      },
      {
        deduplication: { id: invoiceFromDb.id.toString() },
        attempts: PDF_QUEUE_MAX_ATTEMPTS,
        backoff: { type: 'exponential', delay: PDF_QUEUE_BACKOFF_DELAY_MS },
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 86400 },
      },
    );

    return { id: invoiceFromDb.key };
  }

  async updateStatus(id: number, status: InvoiceStatus) {
    await this.invoiceRepository.updateStatus(id, status);
  }

  async getInvoiceStatus(key: string) {
    const invoice = await this.invoiceRepository.getOne(key);
    if (invoice === null) throw new NotFoundException('Invoice not found');
    return invoice.status;
  }

  async getInvoiceStatusById(id: number) {
    const invoice = await this.invoiceRepository.getOneById(id);
    if (invoice === null) return null;
    return invoice.status;
  }

  async expireStaleInvoices() {
    const staleInvoices = await this.invoiceRepository.findStaleInvoices();
    if (staleInvoices.length === 0) return 0;
    const ids = staleInvoices.map((inv) => inv.id);
    await this.invoiceRepository.bulkUpdateStatus(ids, 'expired');
    return ids.length;
  }
}
