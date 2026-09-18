import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerooModule } from '../maileroo/maileroo.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { EmailWorker } from './email.worker';
import {
  EMAIL_QUEUE_NAME,
  JOB_REMOVE_ON_COMPLETE_AGE_SECONDS,
  JOB_REMOVE_ON_FAIL_AGE_SECONDS,
} from '../config/constants';
import { CallbackService } from './callback.service';
import { B2Module } from './b2.module';

@Module({
  imports: [
    MailerooModule,
    B2Module,
    ConfigModule,
    BullModule.registerQueue({
      name: EMAIL_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: { age: JOB_REMOVE_ON_COMPLETE_AGE_SECONDS },
        removeOnFail: { age: JOB_REMOVE_ON_FAIL_AGE_SECONDS },
      },
    }),
  ],
  providers: [
    EmailService,
    EmailWorker,
    CallbackService,
    {
      provide: Redis,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('redis.host'),
          port: parseInt(configService.get('redis.port')!, 10),
          password: configService.get('redis.password'),
          tls: configService.get('redis.tls') === 'true' ? {} : undefined,
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class EmailModule {}
