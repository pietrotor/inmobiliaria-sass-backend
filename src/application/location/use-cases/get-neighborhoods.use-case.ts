import { Inject, Injectable } from '@nestjs/common';
import {
  NeighborhoodRepository,
  NEIGHBORHOOD_REPOSITORY,
} from '@domain/location/repositories/neighborhood.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetNeighborhoodsUseCase {
  constructor(
    @Inject(NEIGHBORHOOD_REPOSITORY)
    private readonly neighborhoodRepository: NeighborhoodRepository,
  ) {}

  async execute(cityId?: string, onlyActive = false) {
    try {
      if (cityId) {
        return await this.neighborhoodRepository.findByCityId(
          cityId,
          onlyActive,
        );
      }
      return await this.neighborhoodRepository.findAll(onlyActive);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GetNeighborhoodsUseCase');
    }
  }
}
