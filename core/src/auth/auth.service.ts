import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { hashFunction } from './hashFunction';
import { ApiKeyRepository } from 'src/db/apiKeyRepository';

@Injectable()
export class AuthService {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}
  async createApiKey() {
    const key = randomBytes(32).toString('hex');
    const hashedKey = hashFunction(key);
    await this.apiKeyRepository.createOne(hashedKey);
  }
}
