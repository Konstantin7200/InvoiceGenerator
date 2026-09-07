import { Body, Controller, Post, StreamableFile } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfDto } from './dto/pdfDto';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}
  @Post()
  async createPdf(@Body() pdfDto: PdfDto) {
    console.log(pdfDto);
    const result = await this.pdfService.createPdf(pdfDto);
    return new StreamableFile(result);
  }
}
