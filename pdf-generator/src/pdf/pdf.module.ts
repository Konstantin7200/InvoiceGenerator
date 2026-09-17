import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PdfService } from './pdf.service';
import { PdfWorker } from './pdf.worker';
import { HtmlGeneratorModule } from '../htmlGenerator/htmlGenerator.module';
import { PDF_QUEUE_NAME, EMAIL_QUEUE_NAME } from '../config/constants';
import { CallbackService } from './callback.service';
import { B2Module } from './b2.module';

@Module({
  imports: [
    HtmlGeneratorModule,
    B2Module,
    BullModule.registerQueue({
      name: PDF_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 86400 },
      },
    }),
    BullModule.registerQueue({
      name: EMAIL_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 86400 },
      },
    }),
  ],
  providers: [PdfService, PdfWorker, CallbackService],
})
export class PdfModule {}
