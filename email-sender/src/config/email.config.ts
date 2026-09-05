import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  mailerooApiKey: process.env.MAILEROO_API_KEY,
  from: process.env.EMAIL_FROM,
}));
