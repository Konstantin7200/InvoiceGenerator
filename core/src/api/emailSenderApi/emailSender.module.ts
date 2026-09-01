import { Module } from '@nestjs/common';
import { emailSenderApi } from './emailSenderApi';

@Module({
  providers: [emailSenderApi],
})
export class InvoiceModule {}
