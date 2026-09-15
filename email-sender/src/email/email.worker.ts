import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EmailService } from './email.service';
import { Job } from 'bullmq';
import { EmailDto } from './dto/email.dto';
import { BullMqValidationPipe } from './pipes/bullmq-validation.pipe';
import { EMAIL_QUEUE_NAME } from '../config/constants';
import { CallbackService } from './callback.service';
import { B2Service } from './b2.service';

@Processor(EMAIL_QUEUE_NAME)
export class EmailWorker extends WorkerHost {
  private readonly validationPipe = new BullMqValidationPipe();

  constructor(
    private readonly emailService: EmailService,
    private readonly callbackService: CallbackService,
    private readonly b2Service: B2Service,
  ) {
    super();
  }

  async process(job: Job<EmailDto>): Promise<void> {
    const body = await this.validationPipe.validate(job.data, EmailDto);
    const pdfBuffer = await this.b2Service.download(body.pdfKey);
    await this.emailService.sendEmail(body.email, pdfBuffer);
    await this.b2Service.delete(body.pdfKey);
    await this.callbackService.updateStatus(body.invoiceId, 'resolved');
  }
}
