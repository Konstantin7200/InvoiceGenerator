import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ClientEntity } from './entities/clientEntity';
import { ClientRepository } from './clientRepository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [ClientEntity],
        synchronize: true,
        retryAttempts: 1,
        retryDelay: 1000,
        connectTimeoutMS: 10000,
      }),
    }),
    TypeOrmModule.forFeature([ClientEntity]),
  ],
  providers: [ClientRepository],
  exports: [ClientRepository],
})
export class DatabaseModule {}
