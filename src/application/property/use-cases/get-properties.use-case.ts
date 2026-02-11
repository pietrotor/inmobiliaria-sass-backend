import { Inject, Injectable } from '@nestjs/common';
import {
  PropertyRepository,
  PROPERTY_REPOSITORY,
} from '@domain/property/repositories/property.repository';
import { FilterPropertiesDto } from '../dto/filter-properties.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(filters: FilterPropertiesDto) {
    try {
      return await this.propertyRepository.findAll(filters);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GetPropertiesUseCase');
    }
  }
}
