import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EmailService } from './email.service';
import { Job } from 'bullmq';
import { EmailDto } from './dto/email.dto';

@Processor('email')
export class EmailWorker extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  async process(job: Job<EmailDto>): Promise<void> {
    const body = job.data;
    await this.emailService.sendEmail(body.email, body.file);
  }
}
