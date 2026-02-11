import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  NeighborhoodRepository,
  NEIGHBORHOOD_REPOSITORY,
} from '@domain/location/repositories/neighborhood.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeleteNeighborhoodUseCase {
  constructor(
    @Inject(NEIGHBORHOOD_REPOSITORY)
    private readonly neighborhoodRepository: NeighborhoodRepository,
  ) {}

  async execute(id: string) {
    try {
      const existing = await this.neighborhoodRepository.findById(id);
      if (!existing) {
        throw new NotFoundException(`Neighborhood with id '${id}' not found`);
      }

      await this.neighborhoodRepository.delete(id);
      return { message: 'Neighborhood deleted successfully' };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'DeleteNeighborhoodUseCase');
    }
  }
}
