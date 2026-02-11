import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CityRepository,
  CITY_REPOSITORY,
} from '@domain/location/repositories/city.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeleteCityUseCase {
  constructor(
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: CityRepository,
  ) {}

  async execute(id: string) {
    try {
      const existing = await this.cityRepository.findById(id);
      if (!existing) {
        throw new NotFoundException(`City with id '${id}' not found`);
      }

      await this.cityRepository.delete(id);
      return { message: 'City deleted successfully' };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'DeleteCityUseCase');
    }
  }
}
