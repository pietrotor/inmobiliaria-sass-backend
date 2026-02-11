import { PropertyImage } from '../entities/property-image.entity';

export const PROPERTY_IMAGE_REPOSITORY = 'PROPERTY_IMAGE_REPOSITORY';

export interface CreatePropertyImageData {
  propertyId: string;
  url: string;
  altText?: string;
  order: number;
  isPrimary: boolean;
}

export interface PropertyImageRepository {
  create(image: CreatePropertyImageData): Promise<PropertyImage>;
  findById(id: string): Promise<PropertyImage | null>;
  findByPropertyId(propertyId: string): Promise<PropertyImage[]>;
  update(id: string, image: Partial<PropertyImage>): Promise<PropertyImage>;
  delete(id: string): Promise<void>;
  deleteByPropertyId(propertyId: string): Promise<void>;
  reorder(propertyId: string, imageIds: string[]): Promise<PropertyImage[]>;
}
