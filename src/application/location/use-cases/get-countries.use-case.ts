import { Inject, Injectable } from '@nestjs/common';
import {
  CountryRepository,
  COUNTRY_REPOSITORY,
} from '@domain/location/repositories/country.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetCountriesUseCase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(onlyActive = false) {
    try {
      return await this.countryRepository.findAll(onlyActive);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GetCountriesUseCase');
    }
  }
}
