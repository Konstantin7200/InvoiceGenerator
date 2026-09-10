import * as Handlebars from 'handlebars';
import { INVOICE_TEMPLATE } from './templates';

export class HtmlGenerator {
  private template: HandlebarsTemplateDelegate;

  constructor() {
    this.template = Handlebars.compile(INVOICE_TEMPLATE);
  }

  generateHtml(
    email: string,
    firstName: string,
    lastName: string,
    companyEmail: string,
    companyName: string,
    jobs: Record<string, number>,
  ): string {
    const jobsArray = Object.entries(jobs).map(([name, amount]) => ({
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
      email,
      firstName,
      lastName,
      companyEmail,
      companyName,
      jobs: jobsArray,
      total: total.toFixed(2),
      invoiceDate,
    };

    return this.template(context);
  }
}
