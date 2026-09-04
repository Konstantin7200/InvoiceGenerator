import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(email: string, file: Buffer) {
    const resend = new Resend(this.configService.get('email.resendApiKey'));

    const from = this.configService.get('email.from')!;

    const encoded = Buffer.from(file).toString('base64');

    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Email with jobs invoice',
      html: '<h1>Your invoice is ready</h1><p>Please find the file attached to this email.</p>',
      attachments: [
        {
          filename: 'invoice.pdf',
          content: encoded,
        },
      ],
    });

    if (error) {
      console.error('Error sending email:', error);
    }

    console.log('Email with attachment sent successfully!');
    console.log('Email ID:', data?.id);
  }
}
