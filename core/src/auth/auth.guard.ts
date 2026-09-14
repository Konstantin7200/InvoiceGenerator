import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyRepository } from 'src/db/apiKeyRepository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}
  canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const apiKey = req.headers['x-api-key'] as string;
    return this.apiKeyRepository.existsOne(apiKey);
  }
}
