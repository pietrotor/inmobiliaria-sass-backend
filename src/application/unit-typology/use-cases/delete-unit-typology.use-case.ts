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
  UnitTypologyRepository,
  UNIT_TYPOLOGY_REPOSITORY,
} from '@domain/unit-typology/repositories/unit-typology.repository';
import { DeleteMediaByEntityUseCase } from '@application/media/use-cases/delete-media-by-entity.use-case';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeleteUnitTypologyUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(UNIT_TYPOLOGY_REPOSITORY)
    private readonly unitTypologyRepository: UnitTypologyRepository,
    private readonly deleteMediaByEntityUseCase: DeleteMediaByEntityUseCase,
  ) {}

  async execute(
    organizationId: string,
    projectId: string,
    typologyId: string,
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

      const typology = await this.unitTypologyRepository.findById(typologyId);

      if (!typology || typology.projectId !== projectId) {
        throw new NotFoundException(
          `Typology with identifier '${typologyId}' not found in this project`,
        );
      }

      await this.unitTypologyRepository.delete(typologyId);
      await this.deleteMediaByEntityUseCase.execute(
        EntityType.TYPOLOGY,
        typologyId,
      );

      return { message: 'Typology deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'DeleteUnitTypologyUseCase');
    }
  }
}
