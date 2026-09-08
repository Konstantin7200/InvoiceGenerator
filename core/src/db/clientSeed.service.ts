import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientRepository } from './clientRepository';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ClientSeedService implements OnModuleInit {
  constructor(private readonly clientRepository: ClientRepository) {}

  async onModuleInit() {
    const seedPath = path.join(__dirname, '..', 'config', 'clients.seed.json');
    console.log(seedPath);
    if (!fs.existsSync(seedPath)) {
      return;
    }

    const raw = fs.readFileSync(seedPath, 'utf-8');
    const clients = JSON.parse(raw);

    if (!Array.isArray(clients) || clients.length === 0) {
      return;
    }

    await this.clientRepository.addIfNotExists(clients);
  }
}
