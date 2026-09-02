import { Injectable } from '@nestjs/common';

export interface EnvConfig {
  port: number;
  dbHost: string;
  dbPort: number;
  dbUsername: string;
  dbPassword: string;
  dbName: string;
}

@Injectable()
export class ConfigService {
  private readonly config: EnvConfig;

  constructor() {
    this.config = {
      port: parseInt(process.env.PORT ?? '3000', 10),
      dbHost: process.env.DB_HOST || 'localhost',
      dbPort: parseInt(process.env.DB_PORT ?? '5432', 10),
      dbUsername: process.env.DB_USERNAME || 'postgres',
      dbPassword: process.env.DB_PASSWORD || 'postgres',
      dbName: process.env.DB_NAME || 'invoice_generator',
    };
  }

  get port(): number {
    return this.config.port;
  }

  get dbHost(): string {
    return this.config.dbHost;
  }

  get dbPort(): number {
    return this.config.dbPort;
  }

  get dbUsername(): string {
    return this.config.dbUsername;
  }

  get dbPassword(): string {
    return this.config.dbPassword;
  }

  get dbName(): string {
    return this.config.dbName;
  }
}
