import { ConfigService } from '@nestjs/config';

export class EmailSenderApi {
  constructor(private readonly configService: ConfigService) {}
  async sendEmail(email: string, pdfDoc: any) {
    await fetch(this.configService.get<string>('EMAIL_API')!, {
      method: 'POST',
      body: JSON.stringify({
        email,
        file: pdfDoc,
      }),
    });
  }
}
