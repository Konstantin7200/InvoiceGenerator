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
  async createInvoice(email: string, jobs: Record<string, number>) {
    const clientFromDb = await this.clientRepository.getOne(email);
    if (clientFromDb === null) throw new NotFoundException('Client not found');
    const { id, ...client } = clientFromDb;
    const file = await this.pdfCreator.createPdf({ ...client, jobs });
    console.log(file);
    await this.emailSender.sendEmail(email, file);
  }
}
