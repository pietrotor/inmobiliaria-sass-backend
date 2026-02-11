import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CountryRepository,
  COUNTRY_REPOSITORY,
} from '@domain/location/repositories/country.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeleteCountryUseCase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(id: string) {
    try {
      const existing = await this.countryRepository.findById(id);
      if (!existing) {
        throw new NotFoundException(`Country with id '${id}' not found`);
      }

      await this.countryRepository.delete(id);
      return { message: 'Country deleted successfully' };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'DeleteCountryUseCase');
    }
  }
}
