import { Module } from '@nestjs/common';
import { pdfCreatorApi } from './pdfCreatorApi';

@Module({
  providers: [pdfCreatorApi],
})
export class InvoiceModule {}
