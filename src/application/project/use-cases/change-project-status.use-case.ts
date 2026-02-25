import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
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
import { ProjectStatus } from '@domain/project/value-objects/project-status.vo';
import { Project } from '@domain/project/entities/project.entity';
import { enrichProjectWithMedia } from '../helpers/enrich-project.helper';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

type TransitionFn = (project: Project) => Project;

const TRANSITIONS: Record<ProjectStatus, TransitionFn> = {
  [ProjectStatus.PUBLISHED]: (project) => project.publish(),
  [ProjectStatus.PAUSED]: (project) => project.pause(),
  [ProjectStatus.CLOSED]: (project) => project.close(),
  [ProjectStatus.DRAFT]: () => {
    throw new BadRequestException(
      'Cannot transition to DRAFT. DRAFT is only the initial state.',
    );
  },
};

@Injectable()
export class ChangeProjectStatusUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
  ) {}

  async execute(organizationId: string, id: string, status: ProjectStatus) {
    try {
      const developer =
        await this.developerRepository.findByOrganizationId(organizationId);

      if (!developer) {
        throw new NotFoundException(
          'Developer profile not found for this organization',
        );
      }

      const project = await this.projectRepository.findById(id);

      if (!project) {
        throw new NotFoundException(
          `Project with identifier '${id}' not found`,
        );
      }

      if (project.developerId !== developer.id) {
        throw new ForbiddenException(
          'You do not have access to this project',
        );
      }

      const transition = TRANSITIONS[status];
      if (!transition) {
        throw new BadRequestException(`Invalid target status: '${status}'`);
      }

      const transitioned = transition(project);

      const updated = await this.projectRepository.update(id, {
        status: transitioned.status,
        publishedAt: transitioned.publishedAt,
        closedAt: transitioned.closedAt,
      } as any);

      return enrichProjectWithMedia(this.mediaRepository, updated);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'ChangeProjectStatusUseCase');
    }
  }
}
