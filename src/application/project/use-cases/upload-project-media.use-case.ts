import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import {
  ProjectRepository,
  PROJECT_REPOSITORY,
} from '@domain/project/repositories/project.repository';
import {
  DeveloperRepository,
  DEVELOPER_REPOSITORY,
} from '@domain/developer/repositories/developer.repository';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { UploadMediaDto } from '@application/media/dto/upload-media.dto';
import { UploadMediaUseCase } from '@application/media/use-cases/upload-media.use-case';
import { enrichProjectWithMedia } from '../helpers/enrich-project.helper';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UploadProjectMediaUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
    private readonly uploadMediaUseCase: UploadMediaUseCase,
  ) {}

  async execute(
    organizationId: string,
    projectId: string,
    dto: Omit<UploadMediaDto, 'entityType' | 'entityId'>,
    file: Express.Multer.File,
  ) {
    try {
      const developer =
        await this.developerRepository.findByOrganizationId(organizationId);

      if (!developer) {
        throw new NotFoundException(
          'Developer profile not found for this organization',
        );
      }

      const project = await this.projectRepository.findById(projectId);

      if (!project) {
        throw new NotFoundException(
          `Project with identifier '${projectId}' not found`,
        );
      }

      if (project.developerId !== developer.id) {
        throw new ForbiddenException(
          'You do not have access to this project',
        );
      }

      await this.uploadMediaUseCase.execute(
        {
          entityType: EntityType.PROJECT,
          entityId: projectId,
          role: dto.role,
          sortOrder: dto.sortOrder,
        },
        file,
      );

      return enrichProjectWithMedia(this.mediaRepository, project);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'UploadProjectMediaUseCase');
    }
  }
}
