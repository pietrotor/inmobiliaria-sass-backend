import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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
export class UploadPropertyImageUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(PROPERTY_IMAGE_REPOSITORY)
    private readonly propertyImageRepository: PropertyImageRepository,
    private readonly s3Service: S3Service,
  ) {}

  async execute(
    propertyId: string,
    file: Express.Multer.File,
    organizationId: string,
    options?: { altText?: string; order?: number; isPrimary?: boolean },
  ) {
    try {
      if (!file) {
        throw new BadRequestException('File is required');
      }

      // Verify property exists
      const property = await this.propertyRepository.findById(propertyId);
      if (!property) {
        throw new NotFoundException(
          `Property with identifier '${propertyId}' not found`,
        );
      }

      // Verify ownership
      if (property.organizationId !== organizationId) {
        throw new ForbiddenException(
          'You do not have permission to upload images to this property',
        );
      }

      // Generate S3 key and upload
      const key = this.s3Service.generateKey(
        organizationId,
        'property',
        propertyId,
        file.originalname,
      );

      const url = await this.s3Service.uploadFile(
        file.buffer,
        key,
        file.mimetype,
      );

      // Get existing images to determine order
      const existingImages =
        await this.propertyImageRepository.findByPropertyId(propertyId);
      const order = options?.order ?? existingImages.length;

      // If marking as primary, unmark others
      if (options?.isPrimary) {
        for (const img of existingImages) {
          if (img.isPrimary) {
            await this.propertyImageRepository.update(img.id, {
              isPrimary: false,
            } as any);
          }
        }
      }

      // If this is the first image, make it primary
      const isPrimary = options?.isPrimary ?? existingImages.length === 0;

      const image = await this.propertyImageRepository.create({
        propertyId,
        url,
        altText: options?.altText,
        order,
        isPrimary,
      });

      return image;
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'UploadPropertyImageUseCase');
    }
  }
}
