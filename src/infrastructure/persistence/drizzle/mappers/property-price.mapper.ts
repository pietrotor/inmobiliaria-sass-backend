import { PropertyPrice } from '@domain/property/entities/property-price.entity';
import { Currency } from '@domain/property/value-objects/currency.vo';
import { PropertyPriceSchema } from '../schema/property-price.schema';

export class PropertyPriceMapper {
  static toDomain(schema: PropertyPriceSchema): PropertyPrice {
    return new PropertyPrice({
      id: schema.id,
      propertyId: schema.propertyId,
      currency: schema.currency as Currency,
      price: Number(schema.price),
      isMain: schema.isMain,
      createdAt: schema.createdAt,
    });
  }

  static toPersistence(
    domain: PropertyPrice,
  ): Omit<PropertyPriceSchema, 'createdAt'> {
    return {
      id: domain.id,
      propertyId: domain.propertyId,
      currency: domain.currency,
      price: String(domain.price),
      isMain: domain.isMain,
    };
  }
}
