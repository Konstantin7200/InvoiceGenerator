import { Injectable } from '@nestjs/common';
import { generatePdf } from 'html-pdf-node';
import { HtmlGenerator } from 'src/htmlGenerator/htmlGenerator';
import { PdfDto } from './dto/pdfDto';

@Injectable()
export class PdfService {
  constructor(private readonly htmlGenerator: HtmlGenerator) {}
  async createPdf({
    email,
    firstName,
    lastName,
    companyEmail,
    companyName,
    jobs,
  }: PdfDto) {
    const htmlTemplate = this.htmlGenerator.generateHtml(
      email,
      firstName,
      lastName,
      companyEmail,
      companyName,
      jobs,
    );

    const pdfFile = await generatePdf({ content: htmlTemplate });
    return pdfFile;
  }
}
