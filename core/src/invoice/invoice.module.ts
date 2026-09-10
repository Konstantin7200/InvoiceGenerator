import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { DatabaseModule } from '../db/db.module';
import {
  PDF_QUEUE_NAME,
  EMAIL_QUEUE_NAME,
  PDF_QUEUE_MAX_ATTEMPTS,
  PDF_QUEUE_BACKOFF_DELAY_MS,
  EMAIL_QUEUE_MAX_ATTEMPTS,
  EMAIL_QUEUE_BACKOFF_DELAY_MS,
  BACKOFF_TYPE,
} from '../config/constants';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue(
      {
        name: PDF_QUEUE_NAME,
        defaultJobOptions: {
          attempts: PDF_QUEUE_MAX_ATTEMPTS,
          backoff: { type: BACKOFF_TYPE, delay: PDF_QUEUE_BACKOFF_DELAY_MS },
        },
      },
      {
        name: EMAIL_QUEUE_NAME,
        defaultJobOptions: {
          attempts: EMAIL_QUEUE_MAX_ATTEMPTS,
          backoff: { type: BACKOFF_TYPE, delay: EMAIL_QUEUE_BACKOFF_DELAY_MS },
        },
      },
    ),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
