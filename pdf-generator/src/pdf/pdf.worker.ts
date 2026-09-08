import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PdfService } from './pdf.service';
import { PdfDto } from './dto/pdfDto';

@Processor('pdf')
export class PdfWorker extends WorkerHost {
  constructor(private readonly pdfService: PdfService) {
    super();
  }

  async process(job: Job<PdfDto>): Promise<Buffer> {
    const result = await this.pdfService.createPdf(job.data);
    return result;
  }
}
