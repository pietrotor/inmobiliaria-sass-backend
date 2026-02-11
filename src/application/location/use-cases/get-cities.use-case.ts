import { Inject, Injectable } from '@nestjs/common';
import {
  CityRepository,
  CITY_REPOSITORY,
} from '@domain/location/repositories/city.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetCitiesUseCase {
  constructor(
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: CityRepository,
  ) {}

  async execute(countryId?: string, onlyActive = false) {
    try {
      if (countryId) {
        return await this.cityRepository.findByCountryId(
          countryId,
          onlyActive,
        );
      }
      return await this.cityRepository.findAll(onlyActive);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GetCitiesUseCase');
    }
  }
}
