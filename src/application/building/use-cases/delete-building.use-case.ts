import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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
  BuildingRepository,
  BUILDING_REPOSITORY,
} from '@domain/building/repositories/building.repository';
import {
  UnitRepository,
  UNIT_REPOSITORY,
} from '@domain/unit/repositories/unit.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeleteBuildingUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(BUILDING_REPOSITORY)
    private readonly buildingRepository: BuildingRepository,
    @Inject(UNIT_REPOSITORY)
    private readonly unitRepository: UnitRepository,
  ) {}

  async execute(
    organizationId: string,
    projectId: string,
    buildingId: string,
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

      const building = await this.buildingRepository.findById(buildingId);

      if (!building || building.projectId !== projectId) {
        throw new NotFoundException(
          `Building with identifier '${buildingId}' not found in this project`,
        );
      }

      const unitCount = await this.unitRepository.countByProjectId(projectId);
      if (unitCount > 0) {
        throw new BadRequestException(
          'Cannot delete a building that has units. Delete or reassign units first.',
        );
      }

      await this.buildingRepository.delete(buildingId);

      return { message: 'Building deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'DeleteBuildingUseCase');
    }
  }
}
