import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from './entities/invoiceEntity';
import { In, LessThan, Repository } from 'typeorm';
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

  async getOne(key: string) {
    return this.repo.findOneBy({ key: key });
  }

  async getOneById(id: number) {
    return this.repo.findOneBy({ id });
  }

  async findOneByEmailAndJobs(email: string, jobs: Record<string, number>) {
    return this.repo
      .createQueryBuilder('invoice')
      .where('invoice.clientEmail = :email', { email })
      .andWhere('invoice.jobs = CAST(:jobs AS jsonb)', {
        jobs: JSON.stringify(jobs),
      })
      .orderBy('invoice.id', 'DESC')
      .limit(1)
      .getOne();
  }

  async findStaleInvoices() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.repo.find({
      where: { status: 'pending', createdAt: LessThan(cutoff) },
    });
  }

  async bulkUpdateStatus(ids: number[], status: InvoiceStatus) {
    if (ids.length === 0) return;
    return this.repo.update({ id: In(ids) }, { status });
  }
}
