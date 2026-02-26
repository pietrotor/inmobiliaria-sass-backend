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
  UnitRepository,
  UNIT_REPOSITORY,
} from '@domain/unit/repositories/unit.repository';
import { DeleteMediaByEntityUseCase } from '@application/media/use-cases/delete-media-by-entity.use-case';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { UnitStatus } from '@domain/unit/value-objects/unit-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeleteUnitUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(UNIT_REPOSITORY)
    private readonly unitRepository: UnitRepository,
    private readonly deleteMediaByEntityUseCase: DeleteMediaByEntityUseCase,
  ) {}

  async execute(organizationId: string, projectId: string, unitId: string) {
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

      const unit = await this.unitRepository.findById(unitId);

      if (!unit || unit.projectId !== projectId) {
        throw new NotFoundException(
          `Unit with identifier '${unitId}' not found in this project`,
        );
      }

      if (
        unit.status === UnitStatus.WITH_INTEREST ||
        unit.status === UnitStatus.RESERVED
      ) {
        throw new BadRequestException(
          'Cannot delete a unit with active interest or reservation.',
        );
      }

      await this.deleteMediaByEntityUseCase.execute(EntityType.UNIT, unitId);
      await this.unitRepository.delete(unitId);

      return { message: 'Unit deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'DeleteUnitUseCase');
    }
  }
}
