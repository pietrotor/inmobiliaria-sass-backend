import { Inject, Injectable } from '@nestjs/common';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetMediaByEntityUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
  ) {}

  async execute(entityType: EntityType, entityId: string, role?: MediaRole) {
    try {
      if (role) {
        return await this.mediaRepository.findByEntityAndRole(
          entityType,
          entityId,
          role,
        );
      }

      return await this.mediaRepository.findByEntity(entityType, entityId);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GetMediaByEntityUseCase');
    }
  }
}
