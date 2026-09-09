import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerooService } from '../maileroo/maileroo.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerooService: MailerooService,
  ) {}

  async sendEmail(email: string, file: string) {
    const from = this.configService.get<string>('email.from')!;

    const result = await this.mailerooService.sendEmail({
      from: { address: from },
      to: [{ address: email }],
      subject: 'Email with jobs invoice',
      html: '<h1>Your invoice is ready</h1><p>Please find the file attached to this email.</p>',
      attachments: [
        {
          file_name: 'invoice.pdf',
          content: file,
          content_type: 'application/pdf',
          inline: false,
        },
      ],
    });


  }
}
