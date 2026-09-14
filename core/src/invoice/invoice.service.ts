import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { ClientRepository } from '../db/clientRepository';
import {
  PDF_QUEUE_NAME,
  EMAIL_QUEUE_NAME,
  JOB_TYPE_GENERATE_PDF,
  JOB_TYPE_SEND_EMAIL,
  PDF_JOB_COMPLETION_TIMEOUT_MS,
  EMAIL_JOB_COMPLETION_TIMEOUT_MS,
} from '../config/constants';
import { InvoiceRepository } from 'src/db/invoiceRepository';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);
  private readonly pdfQueueEvents: QueueEvents;
  private readonly emailQueueEvents: QueueEvents;

  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly invoiceRepository: InvoiceRepository,
    @InjectQueue(PDF_QUEUE_NAME) private readonly pdfQueue: Queue,
    @InjectQueue(EMAIL_QUEUE_NAME) private readonly emailQueue: Queue,
  ) {
    const connection = this.pdfQueue.opts.connection;
    this.pdfQueueEvents = new QueueEvents(PDF_QUEUE_NAME, { connection });
    this.emailQueueEvents = new QueueEvents(EMAIL_QUEUE_NAME, { connection });
  }

  async createInvoice(email: string, jobs: Record<string, number>) {
    const clientFromDb = await this.clientRepository.getOne(email);
    if (clientFromDb === null) throw new NotFoundException('Client not found');

    const { id, ...client } = clientFromDb;
    const invoiceFromDb = await this.invoiceRepository.createInvoice({
      email,
      jobs,
    });
    try {
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

      const pdfJob = await this.pdfQueue.add(JOB_TYPE_GENERATE_PDF, {
        ...client,
        jobs: jobsArray,
        total,
        invoiceDate,
      });

      const pdfResult = (await pdfJob.waitUntilFinished(
        this.pdfQueueEvents,
        PDF_JOB_COMPLETION_TIMEOUT_MS,
      )) as ArrayBuffer;

      const pdfBuffer = Buffer.from(pdfResult);

      const emailJob = await this.emailQueue.add(JOB_TYPE_SEND_EMAIL, {
        email,
        file: pdfBuffer.toString('base64'),
      });
      await emailJob.waitUntilFinished(
        this.emailQueueEvents,
        EMAIL_JOB_COMPLETION_TIMEOUT_MS,
      );
    } catch (error) {
      this.logger.error('Failed to process invoice', error.stack);
      await this.invoiceRepository.updateStatus(invoiceFromDb.id, 'rejected');
      throw new InternalServerErrorException('Failed to process invoice');
    }
    await this.invoiceRepository.updateStatus(invoiceFromDb.id, 'resolved');
  }
}
