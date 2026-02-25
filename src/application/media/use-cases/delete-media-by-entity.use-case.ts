import { Inject, Injectable } from '@nestjs/common';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import {
  StorageService,
  STORAGE_SERVICE,
} from '@domain/common/services/storage.service';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeleteMediaByEntityUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  async execute(entityType: EntityType, entityId: string) {
    try {
      const mediaItems = await this.mediaRepository.findByEntity(
        entityType,
        entityId,
      );

      for (const item of mediaItems) {
        await this.storageService.deleteFile(item.key);
      }

      await this.mediaRepository.deleteAllByEntity(entityType, entityId);

      return { message: `Deleted ${mediaItems.length} media items` };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'DeleteMediaByEntityUseCase');
    }
  }
}
