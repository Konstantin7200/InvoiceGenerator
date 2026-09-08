import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerooModule } from '../maileroo/maileroo.module';
import { BullModule } from '@nestjs/bullmq';
import { EmailWorker } from './email.worker';

@Module({
  imports: [MailerooModule, BullModule.registerQueue({ name: 'email' })],
  providers: [EmailService, EmailWorker],
})
export class EmailModule {}
