import { hash } from 'crypto';

export function hashFunction(key: string) {
  return hash('sha512', key);
}
