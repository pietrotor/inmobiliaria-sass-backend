import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PropertyRepository,
  PROPERTY_REPOSITORY,
} from '@domain/property/repositories/property.repository';
import {
  PropertyImageRepository,
  PROPERTY_IMAGE_REPOSITORY,
} from '@domain/property/repositories/property-image.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

export interface AddPropertyImageDto {
  url: string;
  altText?: string;
  order?: number;
  isPrimary?: boolean;
}

@Injectable()
export class AddPropertyImageUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(PROPERTY_IMAGE_REPOSITORY)
    private readonly propertyImageRepository: PropertyImageRepository,
  ) {}

  async execute(propertyId: string, imageDto: AddPropertyImageDto) {
    try {
      // Verify property exists
      const property = await this.propertyRepository.findById(propertyId);
      if (!property) {
        throw new NotFoundException(
          `Property with identifier '${propertyId}' not found`,
        );
      }

      // Get existing images to determine order
      const existingImages =
        await this.propertyImageRepository.findByPropertyId(propertyId);
      const order =
        imageDto.order ?? existingImages.length;

      // If marking as primary, unmark others
      if (imageDto.isPrimary) {
        for (const img of existingImages) {
          if (img.isPrimary) {
            await this.propertyImageRepository.update(img.id, {
              isPrimary: false,
            } as any);
          }
        }
      }

      // If this is the first image, make it primary
      const isPrimary =
        imageDto.isPrimary ?? existingImages.length === 0;

      const image = await this.propertyImageRepository.create({
        propertyId,
        url: imageDto.url,
        altText: imageDto.altText,
        order,
        isPrimary,
      });

      return image;
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'AddPropertyImageUseCase');
    }
  }
}
