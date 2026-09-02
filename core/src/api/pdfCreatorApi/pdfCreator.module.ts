import { Module } from '@nestjs/common';
import { PdfCreatorApi } from './pdfCreatorApi';

@Module({
  providers: [PdfCreatorApi],
})
export class InvoiceModule {}
