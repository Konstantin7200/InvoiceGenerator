import * as Handlebars from 'handlebars';
import { INVOICE_TEMPLATE } from './templates';
import { PdfDto } from 'src/pdf/dto/pdfDto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HtmlGenerator {
  private template: HandlebarsTemplateDelegate;

  constructor() {
    this.template = Handlebars.compile(INVOICE_TEMPLATE);
  }

  generateHtml(pdfDto: PdfDto): string {
    return this.template(pdfDto);
  }
}
