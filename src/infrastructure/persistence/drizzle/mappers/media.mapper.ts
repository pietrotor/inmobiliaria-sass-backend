import { Media } from '@domain/media/entities/media.entity';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { MediaType } from '@domain/media/value-objects/media-type.vo';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';
import { MediaSchema } from '../schema/media.schema';

export class MediaMapper {
  static toDomain(schema: MediaSchema): Media {
    return new Media({
      id: schema.id,
      entityType: schema.entityType as EntityType,
      entityId: schema.entityId,
      mediaType: schema.mediaType as MediaType,
      role: schema.role as MediaRole,
      url: schema.url,
      key: schema.key,
      filename: schema.filename,
      mimeType: schema.mimeType,
      size: schema.size,
      sortOrder: schema.sortOrder,
      createdAt: schema.createdAt,
    });
  }

  static toPersistence(
    data: Omit<Media, 'id' | 'createdAt'>,
  ): Omit<MediaSchema, 'id' | 'createdAt'> {
    return {
      entityType: data.entityType,
      entityId: data.entityId,
      mediaType: data.mediaType,
      role: data.role,
      url: data.url,
      key: data.key,
      filename: data.filename,
      mimeType: data.mimeType,
      size: data.size,
      sortOrder: data.sortOrder,
    };
  }
}
