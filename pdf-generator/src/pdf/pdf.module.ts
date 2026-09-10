import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PdfService } from './pdf.service';
import { PdfWorker } from './pdf.worker';
import { HtmlGeneratorModule } from '../htmlGenerator/htmlGenerator.module';
import { PDF_QUEUE_NAME } from '../config/constants';

@Module({
  imports: [HtmlGeneratorModule, BullModule.registerQueue({ name: PDF_QUEUE_NAME })],
  providers: [PdfService, PdfWorker],
})
export class PdfModule {}
