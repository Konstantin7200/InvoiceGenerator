import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PdfService } from './pdf.service';
import { PdfWorker } from './pdf.worker';
import { HtmlGeneratorModule } from '../htmlGenerator/htmlGenerator.module';
import {
  PDF_QUEUE_NAME,
  EMAIL_QUEUE_NAME,
  JOB_REMOVE_ON_COMPLETE_AGE_SECONDS,
  JOB_REMOVE_ON_FAIL_AGE_SECONDS,
} from '../config/constants';
import { CallbackService } from './callback.service';
import { B2Module } from './b2.module';

@Module({
  imports: [
    HtmlGeneratorModule,
    B2Module,
    BullModule.registerQueue({
      name: PDF_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: { age: JOB_REMOVE_ON_COMPLETE_AGE_SECONDS },
        removeOnFail: { age: JOB_REMOVE_ON_FAIL_AGE_SECONDS },
      },
    }),
    BullModule.registerQueue({
      name: EMAIL_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: { age: JOB_REMOVE_ON_COMPLETE_AGE_SECONDS },
        removeOnFail: { age: JOB_REMOVE_ON_FAIL_AGE_SECONDS },
      },
    }),
  ],
  providers: [PdfService, PdfWorker, CallbackService],
})
export class PdfModule {}
