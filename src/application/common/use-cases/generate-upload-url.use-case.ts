import { Inject, Injectable } from '@nestjs/common';
import {
  StorageService,
  STORAGE_SERVICE,
} from '@domain/common/services/storage.service';
import { GenerateUploadUrlDto } from '../dto/generate-upload-url.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GenerateUploadUrlUseCase {
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  async execute(dto: GenerateUploadUrlDto) {
    try {
      const key = this.storageService.generateKey({
        context: dto.context,
        entityId: dto.entityId,
        filename: dto.fileName,
        subfolder: dto.subfolder,
      });

      const result = await this.storageService.generateUploadUrl({
        key,
        contentType: dto.contentType,
      });

      return result;
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GenerateUploadUrlUseCase');
    }
  }
}
