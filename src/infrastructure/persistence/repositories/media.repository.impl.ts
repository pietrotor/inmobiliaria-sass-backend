import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { Media } from '@domain/media/entities/media.entity';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';
import {
  MediaRepository,
  CreateMediaData,
} from '@domain/media/repositories/media.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { media } from '../drizzle/schema/media.schema';
import { MediaMapper } from '../drizzle/mappers/media.mapper';

@Injectable()
export class DrizzleMediaRepository implements MediaRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateMediaData): Promise<Media> {
    const [created] = await this.drizzle.db
      .insert(media)
      .values({
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
      })
      .returning();

    return MediaMapper.toDomain(created);
  }

  async findById(id: string): Promise<Media | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(media)
      .where(eq(media.id, id));

    return result ? MediaMapper.toDomain(result) : null;
  }

  async findByEntity(
    entityType: EntityType,
    entityId: string,
  ): Promise<Media[]> {
    const results = await this.drizzle.db
      .select()
      .from(media)
      .where(
        and(eq(media.entityType, entityType), eq(media.entityId, entityId)),
      )
      .orderBy(media.sortOrder);

    return results.map(MediaMapper.toDomain);
  }

  async findByEntityAndRole(
    entityType: EntityType,
    entityId: string,
    role: MediaRole,
  ): Promise<Media[]> {
    const results = await this.drizzle.db
      .select()
      .from(media)
      .where(
        and(
          eq(media.entityType, entityType),
          eq(media.entityId, entityId),
          eq(media.role, role),
        ),
      )
      .orderBy(media.sortOrder);

    return results.map(MediaMapper.toDomain);
  }

  async findOneByEntityAndRole(
    entityType: EntityType,
    entityId: string,
    role: MediaRole,
  ): Promise<Media | null> {
    const [result] = await this.drizzle.db
      .select()
      .from(media)
      .where(
        and(
          eq(media.entityType, entityType),
          eq(media.entityId, entityId),
          eq(media.role, role),
        ),
      )
      .limit(1);

    return result ? MediaMapper.toDomain(result) : null;
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(media).where(eq(media.id, id));
  }

  async deleteAllByEntity(
    entityType: EntityType,
    entityId: string,
  ): Promise<void> {
    await this.drizzle.db
      .delete(media)
      .where(
        and(eq(media.entityType, entityType), eq(media.entityId, entityId)),
      );
  }
}
