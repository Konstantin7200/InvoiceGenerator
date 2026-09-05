import { Module } from '@nestjs/common';
import { MailerooService } from './maileroo.service';

@Module({
  providers: [MailerooService],
  exports: [MailerooService],
})
export class MailerooModule {}
