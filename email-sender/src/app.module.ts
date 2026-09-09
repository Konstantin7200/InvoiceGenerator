import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import serverConfig from './config/server.config';
import emailConfig from './config/email.config';
import redisConfig from './config/redis.config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, emailConfig, redisConfig],
      validationSchema: Joi.object({
        PORT: Joi.number().optional(),
        MAILEROO_API_KEY: Joi.string().required(),
        EMAIL_FROM: Joi.string().email().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().optional(),
        REDIS_TLS: Joi.string().optional(),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
          tls: configService.get('redis.tls') === 'true' ? {} : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
