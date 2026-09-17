import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CallbackService {
  private readonly logger = new Logger(CallbackService.name);
  private readonly coreApiUrl: string;
  private readonly internalApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.coreApiUrl = this.configService.get<string>('core.apiUrl')!;
    this.internalApiKey = this.configService.get<string>(
      'core.internalApiKey',
    )!;
  }

  async updateStatus(invoiceId: number, status: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.coreApiUrl}/invoice/internal/${invoiceId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.internalApiKey,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        this.logger.error(
          `Failed to update invoice status: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      this.logger.error('Failed to update invoice status', error.stack);
    }
  }

  async getStatus(invoiceId: number): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.coreApiUrl}/invoice/internal/${invoiceId}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': this.internalApiKey,
          },
        },
      );

      if (!response.ok) {
        this.logger.error(
          `Failed to get invoice status: ${response.status} ${response.statusText}`,
        );
        return null;
      }

      const data = await response.json();
      return data.status ?? null;
    } catch (error) {
      this.logger.error('Failed to get invoice status', error.stack);
      return null;
    }
  }
}
