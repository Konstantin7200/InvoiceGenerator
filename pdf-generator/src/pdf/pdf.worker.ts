import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PdfService } from './pdf.service';
import { PdfDto } from './dto/pdfDto';
import { BullMqValidationPipe } from './pipes/bullmq-validation.pipe';
import { PDF_QUEUE_NAME } from '../config/constants';

@Processor(PDF_QUEUE_NAME)
export class PdfWorker extends WorkerHost {
  private readonly validationPipe = new BullMqValidationPipe();

  constructor(private readonly pdfService: PdfService) {
    super();
  }

  async process(job: Job<PdfDto>): Promise<Buffer> {
    const data = await this.validationPipe.validate(job.data, PdfDto);
    const result = await this.pdfService.createPdf(data);
    return result;
  }
}
