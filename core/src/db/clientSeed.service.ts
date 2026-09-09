import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientRepository } from './clientRepository';
import * as fs from 'fs';
import * as path from 'path';
import { ClientType } from './types/client';

@Injectable()
export class ClientSeedService implements OnModuleInit {
  constructor(private readonly clientRepository: ClientRepository) {}

  async onModuleInit() {
    const seedPath = path.join(__dirname, '..', 'config', 'clients.seed.json');
    if (!fs.existsSync(seedPath)) {
      return;
    }

    const raw = fs.readFileSync(seedPath, 'utf-8');
    const rawData: unknown = JSON.parse(raw);
    if (!this.isRawClients(rawData))
      throw new InternalServerErrorException('Bad data format in seed');
    const clients = rawData;
    if (clients.length === 0) {
      return;
    }

    await this.clientRepository.addIfNotExists(clients);
  }
  private isRawClient(raw: unknown): raw is ClientType {
    if (typeof raw !== 'object' || raw === null) return false;
    const client = raw as Record<string, unknown>;
    return (
      typeof client.email === 'string' &&
      typeof client.firstName === 'string' &&
      typeof client.lastName === 'string' &&
      typeof client.companyEmail === 'string' &&
      typeof client.companyName === 'string'
    );
  }

  private isRawClients(raw: unknown): raw is ClientType[] {
    if (!Array.isArray(raw)) return false;
    for (let i = 0; i < raw.length; i++) {
      if (!this.isRawClient(raw[i])) return false;
    }
    return true;
  }
}
