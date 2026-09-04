import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PdfCreatorApi {
  constructor(private readonly configService: ConfigService) {}
  async createPdf(
    email: string,
    jobs: Record<string, number>,
  ): Promise<Buffer> {
    const response = await fetch(
      `${this.configService.get('api.pdfUrl')}/pdf`,
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          jobs,
        }),
      },
    );
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
