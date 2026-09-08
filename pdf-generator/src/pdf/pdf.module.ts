import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PdfService } from './pdf.service';
import { PdfWorker } from './pdf.worker';
import { HtmlGeneratorModule } from 'src/htmlGenerator/htmlGenerator.module';

@Module({
  imports: [HtmlGeneratorModule, BullModule.registerQueue({ name: 'pdf' })],
  providers: [PdfService, PdfWorker],
})
export class PdfModule {}
