import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  pdfUrl: process.env.PDF_API,
  emailUrl: process.env.EMAIL_API,
}));
