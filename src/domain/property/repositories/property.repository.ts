import { Property, PropertyProps } from '../entities/property.entity';

export const PROPERTY_REPOSITORY = 'PROPERTY_REPOSITORY';

export type CreatePropertyData = Omit<PropertyProps, 'id' | 'createdAt' | 'updatedAt'>;

export interface FindAllPropertiesOptions {
  organizationId?: string;
  propertyType?: string;
  transactionType?: string;
  status?: string;
  currency?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  state?: string;
  neighborhood?: string;
  bedrooms?: number;
  bathrooms?: number;
  minTotalArea?: number;
  maxTotalArea?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProperties {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PropertyRepository {
  create(property: CreatePropertyData): Promise<Property>;
  findById(id: string): Promise<Property | null>;
  findBySlug(slug: string): Promise<Property | null>;
  findAll(options: FindAllPropertiesOptions): Promise<PaginatedProperties>;
  findByOrganizationId(organizationId: string): Promise<Property[]>;
  update(id: string, property: Partial<Property>): Promise<Property>;
  delete(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
}
