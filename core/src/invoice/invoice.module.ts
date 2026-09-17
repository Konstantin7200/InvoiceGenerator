import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { DatabaseModule } from '../db/db.module';
import { PDF_QUEUE_NAME } from '../config/constants';
import { AuthModule } from 'src/auth/auth.module';
import { InternalAuthGuard } from 'src/auth/internal-auth.guard';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule,
    BullModule.registerQueue({
      name: PDF_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 86400 },
      },
    }),
  ],
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    InternalAuthGuard,
    {
      provide: Redis,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('redis.host') as string,
          port: parseInt(configService.get('redis.port')!, 10),
          password: configService.get('redis.password') as string,
          tls: configService.get('redis.tls') === 'true' ? {} : undefined,
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class InvoiceModule {}
