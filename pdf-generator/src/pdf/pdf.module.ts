import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { HtmlGeneratorModule } from 'src/htmlGenerator/htmlGenerator.module';

@Module({
  imports: [HtmlGeneratorModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
