import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import serverConfig from './config/server.config';
import emailConfig from './config/email.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, emailConfig],
      validationSchema: Joi.object({
        PORT: Joi.number().optional(),
        MAILEROO_API_KEY: Joi.string().required(),
        EMAIL_FROM: Joi.string().email().required(),
      }),
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
