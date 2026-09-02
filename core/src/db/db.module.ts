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
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
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
