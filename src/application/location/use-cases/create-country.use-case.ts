import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  CountryRepository,
  COUNTRY_REPOSITORY,
} from '@domain/location/repositories/country.repository';
import { CreateCountryDto } from '../dto/create-country.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreateCountryUseCase {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(dto: CreateCountryDto) {
    try {
      const existing = await this.countryRepository.findByCode(dto.code);
      if (existing) {
        throw new BadRequestException(
          `Country with code '${dto.code}' already exists`,
        );
      }

      return await this.countryRepository.create(dto);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'CreateCountryUseCase');
    }
  }
}
