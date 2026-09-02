import { Module } from '@nestjs/common';
import { EmailSenderApi } from './emailSenderApi';

@Module({
  providers: [EmailSenderApi],
})
export class InvoiceModule {}
