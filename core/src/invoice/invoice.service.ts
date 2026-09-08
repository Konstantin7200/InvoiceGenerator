import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { ClientRepository } from 'src/db/clientRepository';

@Injectable()
export class InvoiceService {
  private readonly pdfQueueEvents: QueueEvents;
  private readonly emailQueueEvents: QueueEvents;

  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly configService: ConfigService,
    @InjectQueue('pdf') private readonly pdfQueue: Queue,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {
    const connection = {
      host: this.configService.get('redis.host'),
      port: this.configService.get('redis.port'),
    };
    this.pdfQueueEvents = new QueueEvents('pdf', { connection });
    this.emailQueueEvents = new QueueEvents('email', { connection });
  }

  async createInvoice(email: string, jobs: Record<string, number>) {
    const clientFromDb = await this.clientRepository.getOne(email);
    if (clientFromDb === null) throw new NotFoundException('Client not found');

    const { id, ...client } = clientFromDb;

    const pdfJob = await this.pdfQueue.add('generate-pdf', {
      ...client,
      jobs,
    });
    const pdfResult = await pdfJob.waitUntilFinished(
      this.pdfQueueEvents,
      30_000,
    );
    const pdfBuffer = Buffer.from(pdfResult);

    const emailJob = await this.emailQueue.add('send-email', {
      email,
      file: pdfBuffer.toString('base64'),
    });
    await emailJob.waitUntilFinished(this.emailQueueEvents, 10_000);
  }
}
