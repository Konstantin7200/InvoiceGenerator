import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/clientEntity';
import { ClientRepository } from './clientRepository';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

function getEnvConfig(configService: ConfigService) {
  return {
    dbHost: configService.dbHost,
    dbPort: configService.dbPort,
    dbUsername: configService.dbUsername,
    dbPassword: configService.dbPassword,
    dbName: configService.dbName,
  };
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = getEnvConfig(configService);
        return {
          type: 'postgres',
          host: config.dbHost,
          port: config.dbPort,
          username: config.dbUsername,
          password: config.dbPassword,
          database: config.dbName,
          entities: [ClientEntity],
          synchronize: true,
          retryAttempts: 1,
          retryDelay: 1000,
          connectTimeoutMS: 10000,
        };
      },
    }),
    TypeOrmModule.forFeature([ClientEntity]),
  ],
  providers: [ClientRepository],
  exports: [ClientRepository],
})
export class DatabaseModule {}
