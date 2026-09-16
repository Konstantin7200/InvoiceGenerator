import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class B2Service {
  private readonly logger = new Logger(B2Service.name);
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      endpoint: this.configService.get<string>('b2.endpoint')!,
      region: this.configService.get<string>('b2.region')!,
      credentials: {
        accessKeyId: this.configService.get<string>('b2.accessKeyId')!,
        secretAccessKey: this.configService.get<string>('b2.secretAccessKey')!,
      },
      forcePathStyle: true,
    });
    this.bucket = this.configService.get<string>('b2.bucketName')!;
  }

  async download(key: string): Promise<Buffer> {
    const response = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    const stream = response.Body!;
    return Buffer.from(await stream.transformToByteArray());
  }

  async delete(key: string): Promise<void> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(`Failed to delete ${key} from B2`, error.stack);
    }
  }
}
