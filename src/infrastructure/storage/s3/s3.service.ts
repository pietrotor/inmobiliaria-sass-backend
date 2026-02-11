import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { S3Config } from './s3-config.interface';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly config: S3Config;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      region: this.configService.get<string>('AWS_REGION')!,
      bucket: this.configService.get<string>('AWS_S3_BUCKET')!,
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
      secretAccessKey: this.configService.get<string>(
        'AWS_SECRET_ACCESS_KEY',
      )!,
      cdnUrl: this.configService.get<string>('AWS_CLOUDFRONT_URL'),
    };

    this.s3Client = new S3Client({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  /**
   * Uploads a file to S3 and returns the public URL
   */
  async uploadFile(file: Buffer, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      Body: file,
    });

    await this.s3Client.send(command);

    return this.getPublicUrl(key);
  }

  /**
   * Deletes a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  /**
   * Generates a consistent S3 key pattern for images
   * Format: {organizationId}/{entityType}/{entityId}/{imageId}-{timestamp}.{ext}
   */
  generateKey(
    organizationId: string,
    entityType: 'property' | 'unit',
    entityId: string,
    filename: string,
  ): string {
    const timestamp = Date.now();
    const imageId = crypto.randomUUID();
    const extension = filename.split('.').pop() || 'jpg';

    return `${organizationId}/${entityType}s/${entityId}/${imageId}-${timestamp}.${extension}`;
  }

  /**
   * Gets the public URL for a file
   * Uses CloudFront URL if configured, otherwise S3 direct URL
   */
  private getPublicUrl(key: string): string {
    if (this.config.cdnUrl) {
      return `${this.config.cdnUrl}/${key}`;
    }

    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;
  }
}
