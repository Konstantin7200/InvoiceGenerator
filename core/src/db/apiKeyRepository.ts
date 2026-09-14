import { Repository } from 'typeorm';
import { ApiKeyEntity } from './entities/apiKeyEntity';
import { InjectRepository } from '@nestjs/typeorm';

export class ApiKeyRepository {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly repo: Repository<ApiKeyEntity>,
  ) {}
  async createOne(key: string) {
    await this.repo.save({ key: key });
  }
  async existsOne(key: string) {
    const res = await this.repo.findOneBy({ key: key });
    return res !== null;
  }
}
