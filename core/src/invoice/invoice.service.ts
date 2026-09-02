import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailSenderApi } from 'src/api/emailSenderApi/emailSenderApi';
import { PdfCreatorApi } from 'src/api/pdfCreatorApi/pdfCreatorApi';
import { ClientRepository } from 'src/db/clientRepository';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly pdfCreator: PdfCreatorApi,
    private readonly emailSender: EmailSenderApi,
  ) {}
  async createInvoice(email: string, jobs: Map<string, number>) {
    const client = await this.clientRepository.getOne(email);
    if (client === null) throw new NotFoundException('Client not found');
    const file = await this.pdfCreator.createPdf(jobs);
    await this.emailSender.sendEmail(email, file);
  }
}
