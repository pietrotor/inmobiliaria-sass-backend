import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import {
  StorageService,
  STORAGE_SERVICE,
} from '@domain/common/services/storage.service';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeleteMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  async execute(id: string) {
    try {
      const existing = await this.mediaRepository.findById(id);

      if (!existing) {
        throw new NotFoundException(`Media with id '${id}' not found`);
      }

      await this.storageService.deleteFile(existing.key);
      await this.mediaRepository.delete(id);

      return { message: 'Media deleted successfully' };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'DeleteMediaUseCase');
    }
  }
}
