import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Config } from './s3-config.interface';
import {
  StorageService,
  GenerateUploadUrlParams,
  UploadUrlResult,
  UploadFileParams,
  GenerateKeyParams,
} from '@domain/common/services/storage.service';

const DEFAULT_PRESIGNED_URL_EXPIRY = 300;

@Injectable()
export class S3StorageService implements StorageService {
  private readonly s3Client: S3Client;
  private readonly config: S3Config;
  private readonly logger = new Logger(S3StorageService.name);

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

  async generateUploadUrl(
    params: GenerateUploadUrlParams,
  ): Promise<UploadUrlResult> {
    const { key, contentType, expiresInSeconds } = params;

    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(
      this.s3Client as any,
      command,
      { expiresIn: expiresInSeconds ?? DEFAULT_PRESIGNED_URL_EXPIRY },
    );

    this.logger.log(`Generated presigned upload URL for key: ${key}`);

    return {
      uploadUrl,
      publicUrl: this.getPublicUrl(key),
      key,
    };
  }

  async uploadFile(params: UploadFileParams): Promise<string> {
    const { buffer, key, contentType } = params;

    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    this.logger.log(`Uploaded file to S3: ${key}`);
    return this.getPublicUrl(key);
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
    this.logger.log(`Deleted file from S3: ${key}`);
  }

  getPublicUrl(key: string): string {
    if (this.config.cdnUrl) {
      return `${this.config.cdnUrl}/${key}`;
    }

    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;
  }

  extractKeyFromUrl(url: string): string | null {
    try {
      if (this.config.cdnUrl && url.startsWith(this.config.cdnUrl)) {
        return url.replace(`${this.config.cdnUrl}/`, '');
      }

      const s3Prefix = `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/`;
      if (url.startsWith(s3Prefix)) {
        return url.replace(s3Prefix, '');
      }

      return null;
    } catch {
      return null;
    }
  }

  generateKey(params: GenerateKeyParams): string {
    const { context, entityId, filename, subfolder } = params;
    const timestamp = Date.now();
    const uniqueId = crypto.randomUUID();
    const extension = filename.split('.').pop() || 'bin';

    const basePath = subfolder
      ? `${context}/${entityId}/${subfolder}`
      : `${context}/${entityId}`;

    return `${basePath}/${uniqueId}-${timestamp}.${extension}`;
  }
}
