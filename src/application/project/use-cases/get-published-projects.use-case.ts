import { Inject, Injectable, HttpException } from '@nestjs/common';
import {
  ProjectRepository,
  PROJECT_REPOSITORY,
} from '@domain/project/repositories/project.repository';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import { PaginationDto } from '@application/common/dto/pagination.dto';
import { enrichProjectsWithMedia } from '../helpers/enrich-project.helper';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetPublishedProjectsUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
  ) {}

  async execute(pagination: PaginationDto) {
    try {
      const limit = pagination.limit ?? 10;
      const offset = pagination.offset ?? 0;

      const result = await this.projectRepository.findAllPublished(
        limit,
        offset,
      );

      const data = await enrichProjectsWithMedia(
        this.mediaRepository,
        result.data,
      );

      return { ...result, data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GetPublishedProjectsUseCase');
    }
  }
}
