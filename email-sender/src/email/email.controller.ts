import { Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Post()
  async sendEmail(email: string, file: any) {
    await this.emailService.sendEmail(email, file);
  }
}
