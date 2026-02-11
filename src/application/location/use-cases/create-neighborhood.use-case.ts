import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  NeighborhoodRepository,
  NEIGHBORHOOD_REPOSITORY,
} from '@domain/location/repositories/neighborhood.repository';
import {
  CityRepository,
  CITY_REPOSITORY,
} from '@domain/location/repositories/city.repository';
import { CreateNeighborhoodDto } from '../dto/create-neighborhood.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreateNeighborhoodUseCase {
  constructor(
    @Inject(NEIGHBORHOOD_REPOSITORY)
    private readonly neighborhoodRepository: NeighborhoodRepository,
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: CityRepository,
  ) {}

  async execute(dto: CreateNeighborhoodDto) {
    try {
      const city = await this.cityRepository.findById(dto.cityId);
      if (!city) {
        throw new NotFoundException(
          `City with id '${dto.cityId}' not found`,
        );
      }

      return await this.neighborhoodRepository.create(dto);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'CreateNeighborhoodUseCase');
    }
  }
}
