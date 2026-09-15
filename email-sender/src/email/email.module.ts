import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerooModule } from '../maileroo/maileroo.module';
import { BullModule } from '@nestjs/bullmq';
import { EmailWorker } from './email.worker';
import { EMAIL_QUEUE_NAME } from '../config/constants';
import { CallbackService } from './callback.service';
import { B2Module } from './b2.module';

@Module({
  imports: [
    MailerooModule,
    B2Module,
    BullModule.registerQueue({ name: EMAIL_QUEUE_NAME }),
  ],
  providers: [EmailService, EmailWorker, CallbackService],
})
export class EmailModule {}
