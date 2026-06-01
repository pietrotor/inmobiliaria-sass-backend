import {
  Inject,
  Injectable,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import {
  ProjectRepository,
  PROJECT_REPOSITORY,
  ProjectFilters,
} from '@domain/project/repositories/project.repository';
import {
  DeveloperRepository,
  DEVELOPER_REPOSITORY,
} from '@domain/developer/repositories/developer.repository';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import { PaginationDto } from '@application/common/dto/pagination.dto';
import { enrichProjectsWithMedia } from '../helpers/enrich-project.helper';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetProjectsUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
  ) {}

  async execute(
    organizationId: string,
    pagination: PaginationDto,
    filters?: ProjectFilters,
  ) {
    try {
      const developer =
        await this.developerRepository.findByOrganizationId(organizationId);

      if (!developer) {
        throw new NotFoundException(
          'Developer profile not found for this organization',
        );
      }

      const limit = pagination.limit ?? 10;
      const offset = pagination.offset ?? 0;

      const result = await this.projectRepository.findByDeveloperId(
        developer.id,
        limit,
        offset,
        filters,
      );

      const data = await enrichProjectsWithMedia(
        this.mediaRepository,
        result.data,
      );

      return { ...result, data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GetProjectsUseCase');
    }
  }
}
