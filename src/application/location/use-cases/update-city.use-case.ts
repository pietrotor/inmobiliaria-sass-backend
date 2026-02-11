import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CityRepository,
  CITY_REPOSITORY,
} from '@domain/location/repositories/city.repository';
import { UpdateCityDto } from '../dto/update-city.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdateCityUseCase {
  constructor(
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: CityRepository,
  ) {}

  async execute(id: string, dto: UpdateCityDto) {
    try {
      const existing = await this.cityRepository.findById(id);
      if (!existing) {
        throw new NotFoundException(`City with id '${id}' not found`);
      }

      return await this.cityRepository.update(id, dto as any);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'UpdateCityUseCase');
    }
  }
}
