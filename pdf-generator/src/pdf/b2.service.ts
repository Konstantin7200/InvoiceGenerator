import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class B2Service {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      endpoint: this.configService.get<string>('B2_ENDPOINT'),
      region: this.configService.get<string>('B2_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('B2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'B2_SECRET_ACCESS_KEY',
        ),
      },
      forcePathStyle: true,
    });
    this.bucket = this.configService.get<string>('B2_BUCKET_NAME');
  }

  async upload(key: string, body: Buffer): Promise<void> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: 'application/pdf',
      }),
    );
  }
}
