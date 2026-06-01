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
  UnitRepository,
  UNIT_REPOSITORY,
} from '@domain/unit/repositories/unit.repository';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import {
  UnitTypologyRepository,
  UNIT_TYPOLOGY_REPOSITORY,
} from '@domain/unit-typology/repositories/unit-typology.repository';
import {
  BuildingRepository,
  BUILDING_REPOSITORY,
} from '@domain/building/repositories/building.repository';
import { UnitStatus } from '@domain/unit/value-objects/unit-status.vo';
import { UnitAttributes } from '@domain/unit/value-objects/unit-attributes.vo';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { enrichUnitWithMedia } from '../helpers/enrich-unit.helper';
import { validateUnitReferences } from '../helpers/validate-unit-references.helper';
import { resolveUnitFromTypology } from '../helpers/resolve-unit-from-typology.helper';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreateUnitUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(UNIT_REPOSITORY)
    private readonly unitRepository: UnitRepository,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
    @Inject(UNIT_TYPOLOGY_REPOSITORY)
    private readonly unitTypologyRepository: UnitTypologyRepository,
    @Inject(BUILDING_REPOSITORY)
    private readonly buildingRepository: BuildingRepository,
  ) {}

  async execute(
    organizationId: string,
    projectId: string,
    dto: CreateUnitDto,
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

      const typology = await this.unitTypologyRepository.findById(
        dto.typologyId,
      );

      if (!typology || typology.projectId !== projectId) {
        throw new NotFoundException(
          `Typology '${dto.typologyId}' not found in this project`,
        );
      }

      if (dto.type && dto.type !== typology.unitType) {
        throw new BadRequestException(
          `Unit type '${dto.type}' does not match typology unit type '${typology.unitType}'`,
        );
      }

      await validateUnitReferences(
        {
          projectId,
          typologyId: dto.typologyId,
          buildingId: dto.buildingId,
          unitType: typology.unitType,
        },
        {
          typologyRepository: this.unitTypologyRepository,
          buildingRepository: this.buildingRepository,
        },
      );

      const resolved = resolveUnitFromTypology(typology, {
        priceUSD: dto.priceUSD,
        attributes: dto.attributes,
      });

      const unit = await this.unitRepository.create({
        projectId,
        buildingId: dto.buildingId ?? null,
        typologyId: typology.id,
        identifier: dto.identifier,
        type: typology.unitType,
        status: UnitStatus.AVAILABLE,
        priceUSD: resolved.priceUSD,
        commissionPctOverride: dto.commissionPctOverride ?? null,
        attributes: resolved.attributes as unknown as UnitAttributes,
        internalNotes: dto.internalNotes ?? null,
      });

      return enrichUnitWithMedia(this.mediaRepository, unit);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'CreateUnitUseCase');
    }
  }
}
