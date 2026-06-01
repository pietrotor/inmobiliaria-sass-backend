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
import { UpdateUnitTypologyDto } from '../dto/update-unit-typology.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdateUnitTypologyUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(UNIT_TYPOLOGY_REPOSITORY)
    private readonly unitTypologyRepository: UnitTypologyRepository,
  ) {}

  async execute(
    organizationId: string,
    projectId: string,
    typologyId: string,
    dto: UpdateUnitTypologyDto,
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

      return this.unitTypologyRepository.update(typologyId, {
        name: dto.name,
        unitType: dto.unitType,
        basePriceUsd: dto.basePriceUsd,
        baseAttributes: dto.baseAttributes,
        description: dto.description,
        sortOrder: dto.sortOrder,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'UpdateUnitTypologyUseCase');
    }
  }
}
