import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerooModule } from '../maileroo/maileroo.module';
import { BullModule } from '@nestjs/bullmq';
import { EmailWorker } from './email.worker';
import { EMAIL_QUEUE_NAME } from '../config/constants';

@Module({
  imports: [
    MailerooModule,
    BullModule.registerQueue({ name: EMAIL_QUEUE_NAME }),
  ],
  providers: [EmailService, EmailWorker],
})
export class EmailModule {}
