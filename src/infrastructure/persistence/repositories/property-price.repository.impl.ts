import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { PropertyPrice } from '@domain/property/entities/property-price.entity';
import {
  PropertyPriceRepository,
  CreatePropertyPriceData,
} from '@domain/property/repositories/property-price.repository';
import { DrizzleService } from '../drizzle/drizzle.service';
import { propertyPrices } from '../drizzle/schema/property-price.schema';
import { PropertyPriceMapper } from '../drizzle/mappers/property-price.mapper';

@Injectable()
export class DrizzlePropertyPriceRepository implements PropertyPriceRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(priceData: CreatePropertyPriceData): Promise<PropertyPrice> {
    const [created] = await this.drizzle.db
      .insert(propertyPrices)
      .values({
        propertyId: priceData.propertyId,
        currency: priceData.currency,
        price: String(priceData.price),
        isMain: priceData.isMain,
      })
      .returning();

    return PropertyPriceMapper.toDomain(created);
  }

  async findById(id: string): Promise<PropertyPrice | null> {
    const [price] = await this.drizzle.db
      .select()
      .from(propertyPrices)
      .where(eq(propertyPrices.id, id));

    return price ? PropertyPriceMapper.toDomain(price) : null;
  }

  async findByPropertyId(propertyId: string): Promise<PropertyPrice[]> {
    const prices = await this.drizzle.db
      .select()
      .from(propertyPrices)
      .where(eq(propertyPrices.propertyId, propertyId));

    return prices.map(PropertyPriceMapper.toDomain);
  }

  async update(
    id: string,
    data: Partial<PropertyPrice>,
  ): Promise<PropertyPrice> {
    const updateData: any = {};

    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.price !== undefined) updateData.price = String(data.price);
    if (data.isMain !== undefined) updateData.isMain = data.isMain;

    const [updated] = await this.drizzle.db
      .update(propertyPrices)
      .set(updateData)
      .where(eq(propertyPrices.id, id))
      .returning();

    return PropertyPriceMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db
      .delete(propertyPrices)
      .where(eq(propertyPrices.id, id));
  }

  async deleteByPropertyId(propertyId: string): Promise<void> {
    await this.drizzle.db
      .delete(propertyPrices)
      .where(eq(propertyPrices.propertyId, propertyId));
  }
}
