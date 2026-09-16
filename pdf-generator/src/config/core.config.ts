import { registerAs } from '@nestjs/config';

export default registerAs('core', () => ({
  apiUrl: process.env.CORE_API_URL,
  internalApiKey: process.env.INTERNAL_API_KEY,
}));
