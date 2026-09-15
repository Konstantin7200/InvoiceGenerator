import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CallbackService {
  private readonly logger = new Logger(CallbackService.name);
  private readonly coreApiUrl: string;
  private readonly internalApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.coreApiUrl = this.configService.get<string>('CORE_API_URL');
    this.internalApiKey = this.configService.get<string>('INTERNAL_API_KEY');
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
}
