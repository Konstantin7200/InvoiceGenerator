import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './entities/clientEntity';
import { Repository } from 'typeorm';

type PartialClient = Omit<ClientEntity, 'id'>;
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repo: Repository<ClientEntity>,
  ) {}
  async createOne(client: PartialClient) {
    await this.repo.save(client);
  }
  async createMany(clients: PartialClient[]) {
    await this.repo.save(clients);
  }
  async getOne(email: string) {
    const result = await this.repo.findOneBy({ email: email });
    return result;
  }
  async addIfNotExists(clients: PartialClient[]) {
    await this.repo.createQueryBuilder()
      .insert()
      .into(ClientEntity)
      .values(clients)
      .orIgnore()
      .execute();
  }
}
