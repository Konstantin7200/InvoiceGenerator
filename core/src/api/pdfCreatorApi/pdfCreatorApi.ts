import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type CreatePdfDto = {
  email: string;
  firstName: string;
  lastName: string;
  companyEmail: string;
  companyName: string;
  jobs: Record<string, number>;
};
@Injectable()
export class PdfCreatorApi {
  constructor(private readonly configService: ConfigService) {}
  async createPdf(createPdfDto: CreatePdfDto): Promise<Buffer> {
    const response = await fetch(
      `${this.configService.get('api.pdfUrl')}/pdf`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createPdfDto),
      },
    );
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
