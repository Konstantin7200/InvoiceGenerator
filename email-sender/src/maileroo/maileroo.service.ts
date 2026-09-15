import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAILEROO_API_URL, MAILEROO_TIMEOUT_MS } from '../config/constants';

interface MailerooAddress {
  address: string;
}

interface MailerooAttachment {
  file_name: string;
  content: string;
  content_type: string;
  inline: boolean;
}

export interface MailerooRequest {
  from: MailerooAddress;
  to: MailerooAddress[];
  subject: string;
  html: string;
  attachments?: MailerooAttachment[];
}

export interface MailerooResponse {
  success: boolean;
  data: { reference_id: string };
}

@Injectable()
export class MailerooService {
  private readonly apiUrl = MAILEROO_API_URL;

  constructor(private readonly configService: ConfigService) {}

  async sendEmail(payload: MailerooRequest): Promise<MailerooResponse> {
    const apiKey = this.configService.get<string>('email.mailerooApiKey')!;

    const body = JSON.stringify(payload);

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body,
      signal: AbortSignal.timeout(MAILEROO_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new HttpException('Failed to send email', response.status);
    }

    return response.json() as Promise<MailerooResponse>;
  }
}
