import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './entities/clientEntity';
import { Repository } from 'typeorm';
import { ClientType } from './types/client';

export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repo: Repository<ClientEntity>,
  ) {}
  async createOne(client: ClientType) {
    await this.repo.save(client);
  }
  async getOne(email: string) {
    const result = await this.repo.findOneBy({ email: email });
    return result;
  }
  async addIfNotExists(clients: ClientType[]) {
    await this.repo
      .createQueryBuilder()
      .insert()
      .into(ClientEntity)
      .values(clients)
      .orIgnore()
      .execute();
  }
}
