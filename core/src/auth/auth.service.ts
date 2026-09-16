import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { hashFunction } from './hashFunction';
import { ApiKeyRepository } from 'src/db/apiKeyRepository';
import { InternalApiKeyRepository } from 'src/db/internalApiKeyRepository';
import {
  PG_UNIQUE_CONSTRAINT_VIOLATION,
  API_KEY_MAX_RETRIES,
} from 'src/config/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly apiInternalKeyRepository: InternalApiKeyRepository,
  ) {}
  async createApiKey() {
    for (let attempt = 0; attempt < API_KEY_MAX_RETRIES; attempt++) {
      try {
        const key = randomBytes(32).toString('hex');
        const hashedKey = hashFunction(key);
        await this.apiKeyRepository.createOne(hashedKey);
        return key;
      } catch (error) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          (error as { code: string }).code === PG_UNIQUE_CONSTRAINT_VIOLATION
        ) {
          continue;
        }
        throw error;
      }
    }
    throw new InternalServerErrorException(
      'Failed to generate unique API key after max retries',
    );
  }
  async generateInternalKey(): Promise<string> {
    for (let attempt = 0; attempt < API_KEY_MAX_RETRIES; attempt++) {
      try {
        const key = randomBytes(32).toString('hex');
        const hashedKey = hashFunction(key);
        await this.apiInternalKeyRepository.createOne(hashedKey);
        return key;
      } catch (error) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          (error as { code: string }).code === PG_UNIQUE_CONSTRAINT_VIOLATION
        ) {
          continue;
        }
        throw error;
      }
    }
    throw new InternalServerErrorException(
      'Failed to generate unique internal key after max retries',
    );
  }
}
