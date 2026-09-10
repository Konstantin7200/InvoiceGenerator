import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { generatePdf } from 'html-pdf-node';
import { HtmlGenerator } from '../htmlGenerator/htmlGenerator';
import { PdfDto } from './dto/pdfDto';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  constructor(private readonly htmlGenerator: HtmlGenerator) {}
  async createPdf({
    email,
    firstName,
    lastName,
    companyEmail,
    companyName,
    jobs,
  }: PdfDto) {
    try {
      const htmlTemplate = this.htmlGenerator.generateHtml(
        email,
        firstName,
        lastName,
        companyEmail,
        companyName,
        jobs,
      );

      const pdfFile = await generatePdf(
        { content: htmlTemplate },
        { format: 'A4', printBackground: true },
      );
      return pdfFile;
    } catch (error) {
      this.logger.error('Failed to generate PDF', error.stack);
      throw new InternalServerErrorException('Failed to generate PDF');
    }
  }
}
