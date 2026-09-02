import { Module } from '@nestjs/common';
import { HtmlGenerator } from './htmlGenerator';

@Module({
  providers: [HtmlGenerator],
})
export class HtmlGeneratorModule {}
