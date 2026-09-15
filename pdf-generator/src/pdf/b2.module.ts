import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { B2Service } from './b2.service';

@Module({
  imports: [ConfigModule],
  providers: [B2Service],
  exports: [B2Service],
})
export class B2Module {}
