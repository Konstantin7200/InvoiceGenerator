import { ConfigService } from '@nestjs/config';

export class PdfCreatorApi {
  constructor(private readonly configService: ConfigService) {}
  async createPdf(email: string, jobs: Map<string, number>) {
    await fetch(this.configService.get<string>('PDF_API')!, {
      method: 'POST',
      body: JSON.stringify({
        email,
        jobs,
      }),
    });
  }
}
