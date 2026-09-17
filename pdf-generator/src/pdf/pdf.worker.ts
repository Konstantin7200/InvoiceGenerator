import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { PdfService } from './pdf.service';
import { PdfDto } from './dto/pdfDto';
import { BullMqValidationPipe } from './pipes/bullmq-validation.pipe';
import {
  PDF_QUEUE_NAME,
  EMAIL_QUEUE_NAME,
  PDF_QUEUE_MAX_ATTEMPTS,
  PDF_QUEUE_BACKOFF_DELAY_MS,
} from '../config/constants';
import { CallbackService } from './callback.service';
import { B2Service } from './b2.service';
import { Logger } from '@nestjs/common';

const SKIP_STATUSES = ['expired', 'closed'];

@Processor(PDF_QUEUE_NAME)
export class PdfWorker extends WorkerHost {
  private readonly validationPipe = new BullMqValidationPipe();
  private readonly logger = new Logger();

  constructor(
    private readonly pdfService: PdfService,
    private readonly callbackService: CallbackService,
    private readonly b2Service: B2Service,
    @InjectQueue(EMAIL_QUEUE_NAME) private readonly emailQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<PdfDto>): Promise<void> {
    const data = await this.validationPipe.validate(job.data, PdfDto);

    const status = await this.callbackService.getStatus(data.invoiceId);
    if (status && SKIP_STATUSES.includes(status)) {
      this.logger.log(
        `Skipping PDF generation for invoice ${data.invoiceId} — status: ${status}`,
      );
      return;
    }

    try {
      const pdfBuffer = await this.pdfService.createPdf(data);

      const pdfKey = `invoices/${data.invoiceId}.pdf`;
      await this.b2Service.upload(pdfKey, pdfBuffer);

      await this.emailQueue.add(
        'send-email',
        {
          invoiceId: data.invoiceId,
          email: data.email,
          pdfKey,
        },
        {
          attempts: PDF_QUEUE_MAX_ATTEMPTS,
          backoff: { type: 'exponential', delay: PDF_QUEUE_BACKOFF_DELAY_MS },
          removeOnComplete: { age: 3600 },
          removeOnFail: { age: 86400 },
        },
      );
    } catch (error) {
      if (job.attemptsMade >= job.opts.attempts!) {
        await this.callbackService.updateStatus(data.invoiceId, 'closed');
      }
      this.logger.error('Worker failed:', error);
      throw error;
    }
  }
}
