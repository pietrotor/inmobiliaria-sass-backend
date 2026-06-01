import { BadRequestException, NotFoundException } from '@nestjs/common';

import { UnitTypologyRepository } from '@domain/unit-typology/repositories/unit-typology.repository';
import { BuildingRepository } from '@domain/building/repositories/building.repository';
import { UnitType } from '@domain/unit/value-objects/unit-type.vo';

interface ValidateReferencesParams {
  projectId: string;
  typologyId?: string | null;
  buildingId?: string | null;
  unitType: UnitType;
}

export async function validateUnitReferences(
  params: ValidateReferencesParams,
  repos: {
    typologyRepository: UnitTypologyRepository;
    buildingRepository: BuildingRepository;
  },
): Promise<void> {
  const { projectId, typologyId, buildingId, unitType } = params;

  if (typologyId) {
    const typology = await repos.typologyRepository.findById(typologyId);

    if (!typology || typology.projectId !== projectId) {
      throw new NotFoundException(
        `Typology '${typologyId}' not found in this project`,
      );
    }

    if (typology.unitType !== unitType) {
      throw new BadRequestException(
        `Unit type '${unitType}' does not match typology unit type '${typology.unitType}'`,
      );
    }
  }

  if (buildingId) {
    const building = await repos.buildingRepository.findById(buildingId);

    if (!building || building.projectId !== projectId) {
      throw new NotFoundException(
        `Building '${buildingId}' not found in this project`,
      );
    }
  }
}
