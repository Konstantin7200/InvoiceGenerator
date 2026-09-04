import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export class HtmlGenerator {
  private template: HandlebarsTemplateDelegate;

  constructor() {
    const templatePath = path.join(process.cwd(), 'templates', 'invoice.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    this.template = Handlebars.compile(templateSource);
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
