import { PropertyImage } from '@domain/property/entities/property-image.entity';
import { PropertyImageSchema } from '../schema/property-image.schema';

export class PropertyImageMapper {
  static toDomain(schema: PropertyImageSchema): PropertyImage {
    return new PropertyImage({
      id: schema.id,
      propertyId: schema.propertyId,
      url: schema.url,
      altText: schema.altText || undefined,
      order: schema.order,
      isPrimary: schema.isPrimary,
      createdAt: schema.createdAt,
    });
  }

  static toPersistence(
    domain: PropertyImage,
  ): Omit<PropertyImageSchema, 'createdAt'> {
    return {
      id: domain.id,
      propertyId: domain.propertyId,
      url: domain.url,
      altText: domain.altText || null,
      order: domain.order,
      isPrimary: domain.isPrimary,
    };
  }
}
