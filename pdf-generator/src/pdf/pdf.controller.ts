import { Body, Controller, Post } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfDto } from './dto/pdfDto';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}
  @Post()
  async createPdf(@Body() pdfDto: PdfDto) {
    const result = await this.pdfService.createPdf(pdfDto);
    return result;
  }
}
