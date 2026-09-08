import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EmailService } from './email.service';
import { Job } from 'bullmq';
import { EmailDto } from './dto/email.dto';
import { BullMqValidationPipe } from './pipes/bullmq-validation.pipe';

@Processor('email')
export class EmailWorker extends WorkerHost {
  private readonly validationPipe = new BullMqValidationPipe();

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<EmailDto>): Promise<void> {
    const body = await this.validationPipe.validate(job.data, EmailDto);
    await this.emailService.sendEmail(body.email, body.file);
  }
}
