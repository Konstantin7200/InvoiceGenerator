import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { InternalApiKeyRepository } from 'src/db/internalApiKeyRepository';

@Injectable()
export class InternalAuthGuard implements CanActivate {
  constructor(
    private readonly internalApiKeyRepository: InternalApiKeyRepository,
  ) {}
  canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const apiKey = req.headers['x-api-key'] as string;
    return this.internalApiKeyRepository.existsOne(apiKey);
  }
}
