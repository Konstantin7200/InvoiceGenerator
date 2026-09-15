import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfModule } from './pdf/pdf.module';
import serverConfig from './config/server.config';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, redisConfig],
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().optional(),
        REDIS_TLS: Joi.string().required(),
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
          host: configService.get('redis.host') as string,
          port: configService.get('redis.port') as string,
          password: configService.get('redis.password') as string,
          tls: configService.get('redis.tls') === 'true' ? {} : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
