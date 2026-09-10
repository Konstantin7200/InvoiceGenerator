import { ConflictException, Injectable } from '@nestjs/common';
import { ClientRepository } from 'src/db/clientRepository';
import { Client } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}
  async addClient(client: Client) {
    const exists = await this.clientRepository.existsByEmail(client.email);
    if (exists) {
      throw new ConflictException('Client with this email already exists');
    }
    await this.clientRepository.createOne(client);
  }
}
