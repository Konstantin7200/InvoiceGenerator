import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoiceService {
  async createInvoice(email: string, jobs: Map<string, number>) {}
}
