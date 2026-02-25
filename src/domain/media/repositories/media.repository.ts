import { Media } from '../entities/media.entity';
import { EntityType } from '../value-objects/entity-type.vo';
import { MediaType } from '../value-objects/media-type.vo';
import { MediaRole } from '../value-objects/media-role.vo';

export const MEDIA_REPOSITORY = 'MEDIA_REPOSITORY';

export interface CreateMediaData {
  entityType: EntityType;
  entityId: string;
  mediaType: MediaType;
  role: MediaRole;
  url: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  sortOrder: number;
}

export interface MediaRepository {
  create(data: CreateMediaData): Promise<Media>;
  findById(id: string): Promise<Media | null>;
  findByEntity(entityType: EntityType, entityId: string): Promise<Media[]>;
  findByEntityAndRole(
    entityType: EntityType,
    entityId: string,
    role: MediaRole,
  ): Promise<Media[]>;
  findOneByEntityAndRole(
    entityType: EntityType,
    entityId: string,
    role: MediaRole,
  ): Promise<Media | null>;
  delete(id: string): Promise<void>;
  deleteAllByEntity(entityType: EntityType, entityId: string): Promise<void>;
}
