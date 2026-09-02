import { Injectable } from '@nestjs/common';
import { ClientRepository } from 'src/db/clientRepository';
import { Client } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}
  async addClient(client: Client) {
    await this.clientRepository.createOne(client);
  }
}
