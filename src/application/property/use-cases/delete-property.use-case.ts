import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PropertyRepository,
  PROPERTY_REPOSITORY,
} from '@domain/property/repositories/property.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeletePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(id: string) {
    try {
      const property = await this.propertyRepository.findById(id);

      if (!property) {
        throw new NotFoundException(
          `Property with identifier '${id}' not found`,
        );
      }

      await this.propertyRepository.delete(id);

      return {
        message: 'Property deleted successfully',
      };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'DeletePropertyUseCase');
    }
  }
}
