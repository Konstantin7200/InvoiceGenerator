import { Module } from '@nestjs/common';
import { PdfCreatorApi } from './pdfCreatorApi';

@Module({
  providers: [PdfCreatorApi],
  exports: [PdfCreatorApi],
})
export class PdfCreatorModule {}
