import { registerAs } from '@nestjs/config';

export default registerAs('b2', () => ({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  accessKeyId: process.env.B2_ACCESS_KEY_ID,
  secretAccessKey: process.env.B2_SECRET_ACCESS_KEY,
  bucketName: process.env.B2_BUCKET_NAME,
}));
