import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAILEROO_API_URL } from './constants';

@Injectable()
export class MailerooService {
  private readonly apiUrl = MAILEROO_API_URL;

  constructor(private readonly configService: ConfigService) {}

  async sendEmail(
    payload: Record<string, unknown>,
  ): Promise<{ success: boolean; data: { reference_id: string } }> {
    const apiKey = this.configService.get<string>('email.mailerooApiKey')!;

    const body = JSON.stringify(payload);

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body,
    });

    if (!response.ok) {
      throw new HttpException('Failed to send email', response.status);
    }

    return response.json() as Promise<{
      success: boolean;
      data: { reference_id: string };
    }>;
  }
}
