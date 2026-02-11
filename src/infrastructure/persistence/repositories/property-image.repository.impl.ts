import { Injectable } from '@nestjs/common';
import { eq, asc } from 'drizzle-orm';

import { PropertyImage } from '@domain/property/entities/property-image.entity';
import {
  PropertyImageRepository,
  CreatePropertyImageData,
} from '@domain/property/repositories/property-image.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { propertyImages } from '../drizzle/schema/property-image.schema';
import { PropertyImageMapper } from '../drizzle/mappers/property-image.mapper';

@Injectable()
export class DrizzlePropertyImageRepository implements PropertyImageRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(imageData: CreatePropertyImageData): Promise<PropertyImage> {
    const [created] = await this.drizzle.db
      .insert(propertyImages)
      .values({
        propertyId: imageData.propertyId,
        url: imageData.url,
        altText: imageData.altText || null,
        order: imageData.order,
        isPrimary: imageData.isPrimary,
      })
      .returning();

    return PropertyImageMapper.toDomain(created);
  }

  async findById(id: string): Promise<PropertyImage | null> {
    const [image] = await this.drizzle.db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.id, id));

    return image ? PropertyImageMapper.toDomain(image) : null;
  }

  async findByPropertyId(propertyId: string): Promise<PropertyImage[]> {
    const images = await this.drizzle.db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId))
      .orderBy(asc(propertyImages.order));

    return images.map(PropertyImageMapper.toDomain);
  }

  async update(
    id: string,
    imageData: Partial<PropertyImage>,
  ): Promise<PropertyImage> {
    const updateData: any = {};

    if (imageData.url !== undefined) updateData.url = imageData.url;
    if (imageData.altText !== undefined) updateData.altText = imageData.altText;
    if (imageData.order !== undefined) updateData.order = imageData.order;
    if (imageData.isPrimary !== undefined)
      updateData.isPrimary = imageData.isPrimary;

    const [updated] = await this.drizzle.db
      .update(propertyImages)
      .set(updateData)
      .where(eq(propertyImages.id, id))
      .returning();

    return PropertyImageMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db
      .delete(propertyImages)
      .where(eq(propertyImages.id, id));
  }

  async deleteByPropertyId(propertyId: string): Promise<void> {
    await this.drizzle.db
      .delete(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId));
  }

  async reorder(
    propertyId: string,
    imageIds: string[],
  ): Promise<PropertyImage[]> {
    // Update order for each image
    for (let i = 0; i < imageIds.length; i++) {
      await this.drizzle.db
        .update(propertyImages)
        .set({ order: i })
        .where(eq(propertyImages.id, imageIds[i]));
    }

    return this.findByPropertyId(propertyId);
  }
}
