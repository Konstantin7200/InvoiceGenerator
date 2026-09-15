import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { PdfService } from './pdf.service';
import { PdfDto } from './dto/pdfDto';
import { BullMqValidationPipe } from './pipes/bullmq-validation.pipe';
import { PDF_QUEUE_NAME, EMAIL_QUEUE_NAME } from '../config/constants';
import { CallbackService } from './callback.service';
import { B2Service } from './b2.service';

@Processor(PDF_QUEUE_NAME)
export class PdfWorker extends WorkerHost {
  private readonly validationPipe = new BullMqValidationPipe();

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
    const pdfBuffer = await this.pdfService.createPdf(data);

    const pdfKey = `invoices/${data.invoiceId}.pdf`;
    await this.b2Service.upload(pdfKey, pdfBuffer);

    await this.callbackService.updateStatus(data.invoiceId, 'pending');

    await this.emailQueue.add(
      'send-email',
      {
        invoiceId: data.invoiceId,
        email: data.email,
        pdfKey,
      },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );
  }
}
