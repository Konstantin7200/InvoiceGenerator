import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { HtmlGenerator } from '../htmlGenerator/htmlGenerator';
import { PdfDto } from './dto/pdfDto';

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PdfService.name);
  private browser: Browser;

  constructor(private readonly htmlGenerator: HtmlGenerator) {}

  async onModuleInit() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
  }

  async onModuleDestroy() {
    await this.browser?.close();
  }

  async createPdf(pdfDto: PdfDto) {
    try {
      const htmlTemplate = this.htmlGenerator.generateHtml(pdfDto);
      const page = await this.browser.newPage();
      try {
        await page.setContent(htmlTemplate);
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
        });
        return Buffer.from(pdfBuffer);
      } finally {
        await page.close();
      }
    } catch (error) {
      this.logger.error('Failed to generate PDF', error.stack);
      throw new InternalServerErrorException('Failed to generate PDF');
    }
  }
}
