import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PropertyRepository,
  PROPERTY_REPOSITORY,
} from '@domain/property/repositories/property.repository';
import {
  PropertyImageRepository,
  PROPERTY_IMAGE_REPOSITORY,
} from '@domain/property/repositories/property-image.repository';
import {
  PropertyPriceRepository,
  PROPERTY_PRICE_REPOSITORY,
} from '@domain/property/repositories/property-price.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetPropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(PROPERTY_IMAGE_REPOSITORY)
    private readonly propertyImageRepository: PropertyImageRepository,
    @Inject(PROPERTY_PRICE_REPOSITORY)
    private readonly propertyPriceRepository: PropertyPriceRepository,
  ) {}

  async execute(id: string) {
    try {
      const property = await this.propertyRepository.findById(id);

      if (!property) {
        throw new NotFoundException(
          `Property with identifier '${id}' not found`,
        );
      }

      const [images, prices] = await Promise.all([
        this.propertyImageRepository.findByPropertyId(id),
        this.propertyPriceRepository.findByPropertyId(id),
      ]);

      return {
        ...property,
        images,
        prices,
      };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GetPropertyUseCase');
    }
  }
}
