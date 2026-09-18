import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { DatabaseModule } from '../db/db.module';
import {
  PDF_QUEUE_NAME,
  JOB_REMOVE_ON_COMPLETE_AGE_SECONDS,
  JOB_REMOVE_ON_FAIL_AGE_SECONDS,
} from '../config/constants';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule,
    BullModule.registerQueue({
      name: PDF_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: { age: JOB_REMOVE_ON_COMPLETE_AGE_SECONDS },
        removeOnFail: { age: JOB_REMOVE_ON_FAIL_AGE_SECONDS },
      },
    }),
  ],
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
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
export class InvoiceModule {}
