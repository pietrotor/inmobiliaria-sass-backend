import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CountryRepository,
  COUNTRY_REPOSITORY,
} from '@domain/location/repositories/country.repository';
import { UpdateCountryDto } from '../dto/update-country.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdateCountryUseCase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(id: string, dto: UpdateCountryDto) {
    try {
      const existing = await this.countryRepository.findById(id);
      if (!existing) {
        throw new NotFoundException(`Country with id '${id}' not found`);
      }

      return await this.countryRepository.update(id, dto as any);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'UpdateCountryUseCase');
    }
  }
}
