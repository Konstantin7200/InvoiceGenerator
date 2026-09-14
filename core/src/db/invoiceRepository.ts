import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from './entities/invoiceEntity';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from '../invoice/dto/createInvoice.dto';
import { InvoiceStatus } from './types/invoiceStatus';

export class InvoiceRepository {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly repo: Repository<InvoiceEntity>,
  ) {}

  async createInvoice(invoice: CreateInvoiceDto) {
    const newInvoice = this.repo.create({
      jobs: invoice.jobs,
      client: { email: invoice.email },
    });
    return this.repo.save(newInvoice);
  }

  async updateStatus(id: number, status: InvoiceStatus) {
    return this.repo.update(id, { status });
  }
}
