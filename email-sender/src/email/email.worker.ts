import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EmailService } from './email.service';
import { Job } from 'bullmq';
import Redis from 'ioredis';
import { EmailDto } from './dto/email.dto';
import { BullMqValidationPipe } from './pipes/bullmq-validation.pipe';
import { EMAIL_QUEUE_NAME, EMAIL_DEDUP_TTL_SECONDS } from '../config/constants';
import { CallbackService } from './callback.service';
import { B2Service } from './b2.service';
import { Logger } from '@nestjs/common';

const SKIP_STATUSES = ['expired', 'closed'];

@Processor(EMAIL_QUEUE_NAME)
export class EmailWorker extends WorkerHost {
  private readonly validationPipe = new BullMqValidationPipe();
  private readonly logger = new Logger();

  constructor(
    private readonly emailService: EmailService,
    private readonly callbackService: CallbackService,
    private readonly b2Service: B2Service,
    private readonly redis: Redis,
  ) {
    super();
  }

  async process(job: Job<EmailDto>): Promise<void> {
    const body = await this.validationPipe.validate(job.data, EmailDto);

    const status = await this.callbackService.getStatus(body.invoiceId);
    if (status && SKIP_STATUSES.includes(status)) {
      this.logger.log(
        `Skipping email for invoice ${body.invoiceId} — status: ${status}`,
      );
      return;
    }

    const dedupKey = `email-sent:${body.invoiceId}`;
    const isNew = await this.redis.set(
      dedupKey,
      '1',
      'EX',
      EMAIL_DEDUP_TTL_SECONDS,
      'NX',
    );

    if (!isNew) {
      this.logger.log(
        `Email already sent for invoice ${body.invoiceId} — skipping`,
      );
      await this.callbackService.updateStatus(body.invoiceId, 'resolved');
      return;
    }

    try {
      const pdfBuffer = await this.b2Service.download(body.pdfKey);
      await this.emailService.sendEmail(body.email, pdfBuffer);
      await this.b2Service.delete(body.pdfKey);
      await this.callbackService.updateStatus(body.invoiceId, 'resolved');
    } catch (err) {
      if (job.attemptsMade >= job.opts.attempts!) {
        await this.callbackService.updateStatus(body.invoiceId, 'closed');
        await this.redis.del(dedupKey);
      }
      this.logger.error('Worker failed:', err);
      throw err;
    }
  }
}
