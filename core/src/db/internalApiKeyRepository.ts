import { Repository } from 'typeorm';
import { InternalApiKeyEntity } from './entities/internalApiKeyEntity';
import { InjectRepository } from '@nestjs/typeorm';

export class InternalApiKeyRepository {
  constructor(
    @InjectRepository(InternalApiKeyEntity)
    private readonly repo: Repository<InternalApiKeyEntity>,
  ) {}
  async createOne(key: string) {
    await this.repo.save({ key: key });
  }
  async existsOne(key: string) {
    const res = await this.repo.findOneBy({ key: key });
    return res !== null;
  }
}
