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
  UnitTypologyRepository,
  UNIT_TYPOLOGY_REPOSITORY,
} from '@domain/unit-typology/repositories/unit-typology.repository';
import {
  BuildingRepository,
  BUILDING_REPOSITORY,
} from '@domain/building/repositories/building.repository';
import { UnitStatus } from '@domain/unit/value-objects/unit-status.vo';
import { UnitAttributes } from '@domain/unit/value-objects/unit-attributes.vo';
import { UnitTypology } from '@domain/unit-typology/entities/unit-typology.entity';
import { BulkCreateUnitsDto } from '../dto/bulk-create-units.dto';
import { validateUnitReferences } from '../helpers/validate-unit-references.helper';
import { resolveUnitFromTypology } from '../helpers/resolve-unit-from-typology.helper';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class BulkCreateUnitUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(UNIT_REPOSITORY)
    private readonly unitRepository: UnitRepository,
    @Inject(UNIT_TYPOLOGY_REPOSITORY)
    private readonly unitTypologyRepository: UnitTypologyRepository,
    @Inject(BUILDING_REPOSITORY)
    private readonly buildingRepository: BuildingRepository,
  ) {}

  async execute(
    organizationId: string,
    projectId: string,
    dto: BulkCreateUnitsDto,
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

      const incomingIdentifiers = dto.units.map((u) => u.identifier);
      const duplicatesInBatch = incomingIdentifiers.filter(
        (id, idx) => incomingIdentifiers.indexOf(id) !== idx,
      );
      if (duplicatesInBatch.length > 0) {
        throw new BadRequestException(
          `Duplicate identifiers in batch: ${[...new Set(duplicatesInBatch)].join(', ')}`,
        );
      }

      const existingIdentifiers =
        await this.unitRepository.findIdentifiersByProjectId(projectId);
      const collisions = incomingIdentifiers.filter((id) =>
        existingIdentifiers.includes(id),
      );
      if (collisions.length > 0) {
        throw new BadRequestException(
          `Identifiers already exist in project: ${collisions.join(', ')}`,
        );
      }

      const typologyIds = [...new Set(dto.units.map((u) => u.typologyId))];
      const typologyMap = new Map<string, UnitTypology>();

      for (const typologyId of typologyIds) {
        const typology =
          await this.unitTypologyRepository.findById(typologyId);

        if (!typology || typology.projectId !== projectId) {
          throw new NotFoundException(
            `Typology '${typologyId}' not found in this project`,
          );
        }

        typologyMap.set(typologyId, typology);
      }

      for (const u of dto.units) {
        const typology = typologyMap.get(u.typologyId)!;

        if (u.type && u.type !== typology.unitType) {
          throw new BadRequestException(
            `Unit '${u.identifier}': type '${u.type}' does not match typology '${typology.name}' unit type '${typology.unitType}'`,
          );
        }
      }

      const uniqueBuildingRefs = new Set<string>();
      for (const u of dto.units) {
        const typology = typologyMap.get(u.typologyId)!;
        const key = `${u.buildingId ?? ''}|${typology.unitType}`;
        if (uniqueBuildingRefs.has(key)) continue;
        uniqueBuildingRefs.add(key);

        await validateUnitReferences(
          {
            projectId,
            typologyId: u.typologyId,
            buildingId: u.buildingId,
            unitType: typology.unitType,
          },
          {
            typologyRepository: this.unitTypologyRepository,
            buildingRepository: this.buildingRepository,
          },
        );
      }

      const unitsData = dto.units.map((u) => {
        const typology = typologyMap.get(u.typologyId)!;
        const resolved = resolveUnitFromTypology(typology, {
          priceUSD: u.priceUSD,
          attributes: u.attributes,
        });

        return {
          projectId,
          buildingId: u.buildingId ?? null,
          typologyId: typology.id,
          identifier: u.identifier,
          type: typology.unitType,
          status: UnitStatus.AVAILABLE,
          priceUSD: resolved.priceUSD,
          commissionPctOverride: u.commissionPctOverride ?? null,
          attributes: resolved.attributes as unknown as UnitAttributes,
          internalNotes: u.internalNotes ?? null,
        };
      });

      const count = await this.unitRepository.createMany(unitsData);

      return { created: count };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'BulkCreateUnitUseCase');
    }
  }
}
