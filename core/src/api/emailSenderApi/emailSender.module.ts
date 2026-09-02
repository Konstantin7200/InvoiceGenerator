import { Module } from '@nestjs/common';
import { EmailSenderApi } from './emailSenderApi';

@Module({
  providers: [EmailSenderApi],
  exports: [EmailSenderApi],
})
export class EmailSenderModule {}
