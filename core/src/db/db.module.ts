import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ClientEntity } from './entities/clientEntity';
import { InvoiceEntity } from './entities/invoiceEntity';
import { ClientRepository } from './clientRepository';
import { InvoiceRepository } from './invoiceRepository';
import { ClientSeedService } from './clientSeed.service';
import {
  DB_TYPE,
  DB_RETRY_ATTEMPTS,
  DB_RETRY_DELAY_MS,
  DB_CONNECT_TIMEOUT_MS,
} from '../config/constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: DB_TYPE,
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        ssl:
          configService.get('database.ssl') === 'true'
            ? { rejectUnauthorized: false }
            : undefined,
        entities: [ClientEntity, InvoiceEntity],
        synchronize: true,
        retryAttempts: DB_RETRY_ATTEMPTS,
        retryDelay: DB_RETRY_DELAY_MS,
        connectTimeoutMS: DB_CONNECT_TIMEOUT_MS,
      }),
    }),
    TypeOrmModule.forFeature([ClientEntity, InvoiceEntity]),
  ],
  providers: [ClientRepository, InvoiceRepository, ClientSeedService],
  exports: [ClientRepository, InvoiceRepository],
})
export class DatabaseModule {}
