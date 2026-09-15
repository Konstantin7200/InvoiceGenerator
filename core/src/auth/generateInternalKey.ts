import { randomBytes } from 'crypto';
import { hashFunction } from './hashFunction';
import { InternalApiKeyRepository } from 'src/db/internalApiKeyRepository';

export async function generateInternalKey(
  repository: InternalApiKeyRepository,
): Promise<string> {
  const key = randomBytes(32).toString('hex');
  const hashedKey = hashFunction(key);
  await repository.createOne(hashedKey);
  return key;
}
