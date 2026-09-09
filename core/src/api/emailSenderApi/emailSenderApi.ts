import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailSenderApi {
  constructor(private readonly configService: ConfigService) {}
  async sendEmail(email: string, pdfDoc: Buffer) {
    const response = await fetch(
      `${this.configService.get('api.emailUrl')}/email`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          file: pdfDoc.toString('base64'),
        }),
      },
    );

  }
}
