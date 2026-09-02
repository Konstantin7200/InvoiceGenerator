import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { DatabaseModule } from '../db/db.module';
import { PdfCreatorModule } from '../api/pdfCreatorApi/pdfCreator.module';
import { EmailSenderModule } from '../api/emailSenderApi/emailSender.module';

@Module({
  imports: [DatabaseModule, PdfCreatorModule, EmailSenderModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
