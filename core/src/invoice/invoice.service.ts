import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ClientRepository } from '../db/clientRepository';
import {
  PDF_QUEUE_NAME,
  JOB_TYPE_GENERATE_PDF,
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
  ) {}

  async createInvoice(email: string, jobs: Record<string, number>) {
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

    await this.pdfQueue.add(JOB_TYPE_GENERATE_PDF, {
      invoiceId: invoiceFromDb.id,
      firstName,
      lastName,
      email,
      companyEmail,
      companyName,
      jobs: jobsArray,
      total,
      invoiceDate,
    });

    return { id: invoiceFromDb.id };
  }

  async updateStatus(id: number, status: InvoiceStatus) {
    await this.invoiceRepository.updateStatus(id, status);
  }

  async getInvoiceStatus(key: string) {
    const invoice = await this.invoiceRepository.getOne(key);
    if (invoice === null) throw new NotFoundException('Invoice not found');
    else {
      return invoice.status;
    }
  }
}
