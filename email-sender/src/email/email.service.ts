import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(email: string, file: string) {
    const resend = new Resend(this.configService.get('email.resendApiKey'));
    const from: string = this.configService.get('email.from')!;

    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Email with jobs invoice',
      html: '<h1>Your invoice is ready</h1><p>Please find the file attached to this email.</p>',
      attachments: [
        {
          filename: 'invoice.pdf',
          content: file,
        },
      ],
    });
    console.log(data);
    console.log(error);

    console.log("Done");
  }
}
