import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerooModule } from '../maileroo/maileroo.module';

@Module({
  imports: [MailerooModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
