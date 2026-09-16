import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import serverConfig from './config/server.config';
import emailConfig from './config/email.config';
import redisConfig from './config/redis.config';
import b2Config from './config/b2.config';
import coreConfig from './config/core.config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, emailConfig, redisConfig, b2Config, coreConfig],
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MAILEROO_API_KEY: Joi.string().required(),
        EMAIL_FROM: Joi.string().email().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().optional(),
        REDIS_TLS: Joi.string().optional(),
        CORE_API_URL: Joi.string().uri().required(),
        INTERNAL_API_KEY: Joi.string().required(),
        B2_ENDPOINT: Joi.string().uri().required(),
        B2_REGION: Joi.string().required(),
        B2_ACCESS_KEY_ID: Joi.string().required(),
        B2_SECRET_ACCESS_KEY: Joi.string().required(),
        B2_BUCKET_NAME: Joi.string().required(),
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
