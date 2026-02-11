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

@Injectable()
export class GetPropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(PROPERTY_IMAGE_REPOSITORY)
    private readonly propertyImageRepository: PropertyImageRepository,
  ) {}

  async execute(id: string) {
    try {
      const property = await this.propertyRepository.findById(id);

      if (!property) {
        throw new NotFoundException(
          `Property with identifier '${id}' not found`,
        );
      }

      const images = await this.propertyImageRepository.findByPropertyId(id);

      return {
        ...property,
        images,
      };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GetPropertyUseCase');
    }
  }
}
