import { ConflictException, Injectable } from '@nestjs/common';
import { ClientRepository } from '../db/clientRepository';
import { Client } from './dto/client.dto';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from '../config/constants';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}
  async addClient(client: Client) {
    try {
      await this.clientRepository.createOne(client);
    } catch (error) {
      if (error?.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        throw new ConflictException('Client with this email already exists');
      }
      throw error;
    }
  }
}
