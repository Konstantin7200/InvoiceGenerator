import { Module } from '@nestjs/common';
import { PdfCreatorApi } from './pdfCreatorApi';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [PdfCreatorApi],
  exports: [PdfCreatorApi],
})
export class PdfCreatorModule {}
