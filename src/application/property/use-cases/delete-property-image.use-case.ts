import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  PropertyRepository,
  PROPERTY_REPOSITORY,
} from '@domain/property/repositories/property.repository';
import {
  PropertyImageRepository,
  PROPERTY_IMAGE_REPOSITORY,
} from '@domain/property/repositories/property-image.repository';
import { S3Service } from '@infrastructure/storage/s3/s3.service';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeletePropertyImageUseCase {
  private readonly logger = new Logger(DeletePropertyImageUseCase.name);

  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(PROPERTY_IMAGE_REPOSITORY)
    private readonly propertyImageRepository: PropertyImageRepository,
    private readonly s3Service: S3Service,
  ) {}

  async execute(imageId: string, organizationId: string) {
    try {
      const image = await this.propertyImageRepository.findById(imageId);

      if (!image) {
        throw new NotFoundException(
          `Image with identifier '${imageId}' not found`,
        );
      }

      // Verify property belongs to user's organization
      const property = await this.propertyRepository.findById(
        image.propertyId,
      );
      if (!property || property.organizationId !== organizationId) {
        throw new ForbiddenException(
          'You do not have permission to delete this image',
        );
      }

      // Try to delete the file from S3 if the URL matches
      const s3Key = this.s3Service.extractKeyFromUrl(image.url);
      if (s3Key) {
        try {
          await this.s3Service.deleteFile(s3Key);
        } catch (s3Error) {
          // Log but don't fail — the DB record should still be deleted
          this.logger.warn(
            `Failed to delete S3 object '${s3Key}': ${s3Error}`,
          );
        }
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
