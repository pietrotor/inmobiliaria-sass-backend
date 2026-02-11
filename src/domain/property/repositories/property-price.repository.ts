import { PropertyPrice } from '../entities/property-price.entity';
import { Currency } from '../value-objects/currency.vo';

export const PROPERTY_PRICE_REPOSITORY = 'PROPERTY_PRICE_REPOSITORY';

export interface CreatePropertyPriceData {
  propertyId: string;
  currency: Currency;
  price: number;
  isMain: boolean;
}

export interface PropertyPriceRepository {
  create(price: CreatePropertyPriceData): Promise<PropertyPrice>;
  findById(id: string): Promise<PropertyPrice | null>;
  findByPropertyId(propertyId: string): Promise<PropertyPrice[]>;
  update(id: string, data: Partial<PropertyPrice>): Promise<PropertyPrice>;
  delete(id: string): Promise<void>;
  deleteByPropertyId(propertyId: string): Promise<void>;
}
