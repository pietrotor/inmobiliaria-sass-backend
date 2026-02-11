import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CityRepository,
  CITY_REPOSITORY,
} from '@domain/location/repositories/city.repository';
import {
  CountryRepository,
  COUNTRY_REPOSITORY,
} from '@domain/location/repositories/country.repository';
import { CreateCityDto } from '../dto/create-city.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreateCityUseCase {
  constructor(
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: CityRepository,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(dto: CreateCityDto) {
    try {
      const country = await this.countryRepository.findById(dto.countryId);
      if (!country) {
        throw new NotFoundException(
          `Country with id '${dto.countryId}' not found`,
        );
      }

      return await this.cityRepository.create(dto);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'CreateCityUseCase');
    }
  }
}
