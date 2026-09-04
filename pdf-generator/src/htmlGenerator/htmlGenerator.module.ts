import { Module } from '@nestjs/common';
import { HtmlGenerator } from './htmlGenerator';

@Module({
  providers: [HtmlGenerator],
  exports: [HtmlGenerator],
})
export class HtmlGeneratorModule {}
