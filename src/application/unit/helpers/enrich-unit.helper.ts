import { Unit } from '@domain/unit/entities/unit.entity';
import { Media } from '@domain/media/entities/media.entity';
import { MediaRepository } from '@domain/media/repositories/media.repository';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';

export type UnitWithMedia = Unit & {
  coverImage: Media | null;
  media: Media[];
};

export async function enrichUnitWithMedia(
  mediaRepository: MediaRepository,
  unit: Unit,
): Promise<UnitWithMedia> {
  const media = await mediaRepository.findByEntity(EntityType.UNIT, unit.id);
  const coverImage = media.find((m) => m.role === MediaRole.COVER) ?? null;
  return Object.assign(unit, { coverImage, media });
}

export async function enrichUnitsWithMedia(
  mediaRepository: MediaRepository,
  units: Unit[],
): Promise<UnitWithMedia[]> {
  return Promise.all(
    units.map((unit) => enrichUnitWithMedia(mediaRepository, unit)),
  );
}
