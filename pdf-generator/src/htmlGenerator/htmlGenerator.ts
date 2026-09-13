import * as Handlebars from 'handlebars';
import { INVOICE_TEMPLATE } from './templates';
import { PdfDto } from 'src/pdf/dto/pdfDto';

export class HtmlGenerator {
  private template: HandlebarsTemplateDelegate;

  constructor() {
    this.template = Handlebars.compile(INVOICE_TEMPLATE);
  }

  generateHtml(pdfDto: PdfDto): string {
    const jobsArray = Object.entries(pdfDto.jobs).map(([name, amount]) => ({
      name,
      amount: amount.toFixed(2),
    }));

    const total = jobsArray.reduce(
      (sum, job) => sum + parseFloat(job.amount),
      0,
    );

    const invoiceDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const context = {
      ...pdfDto,
      jobs: jobsArray,
      total: total.toFixed(2),
      invoiceDate,
    };

    return this.template(context);
  }
}
