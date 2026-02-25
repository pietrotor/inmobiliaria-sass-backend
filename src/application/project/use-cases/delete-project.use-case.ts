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
import { DeleteMediaByEntityUseCase } from '@application/media/use-cases/delete-media-by-entity.use-case';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    private readonly deleteMediaByEntityUseCase: DeleteMediaByEntityUseCase,
  ) {}

  async execute(organizationId: string, id: string) {
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

      if (project.isPublished()) {
        throw new BadRequestException(
          'Cannot delete a published project. Pause or close it first.',
        );
      }

      await this.deleteMediaByEntityUseCase.execute(
        EntityType.PROJECT,
        id,
      );
      await this.projectRepository.delete(id);

      return { message: 'Project deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'DeleteProjectUseCase');
    }
  }
}
