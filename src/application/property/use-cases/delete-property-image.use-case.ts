import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PropertyImageRepository,
  PROPERTY_IMAGE_REPOSITORY,
} from '@domain/property/repositories/property-image.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeletePropertyImageUseCase {
  constructor(
    @Inject(PROPERTY_IMAGE_REPOSITORY)
    private readonly propertyImageRepository: PropertyImageRepository,
  ) {}

  async execute(imageId: string) {
    try {
      const image = await this.propertyImageRepository.findById(imageId);

      if (!image) {
        throw new NotFoundException(
          `Image with identifier '${imageId}' not found`,
        );
      }

      await this.propertyImageRepository.delete(imageId);

      // If the deleted image was primary, promote the next one
      if (image.isPrimary) {
        const remainingImages =
          await this.propertyImageRepository.findByPropertyId(
            image.propertyId,
          );
        if (remainingImages.length > 0) {
          await this.propertyImageRepository.update(remainingImages[0].id, {
            isPrimary: true,
          } as any);
        }
      }

      return {
        message: 'Image deleted successfully',
      };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'DeletePropertyImageUseCase');
    }
  }
}
