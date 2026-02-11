import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  NeighborhoodRepository,
  NEIGHBORHOOD_REPOSITORY,
} from '@domain/location/repositories/neighborhood.repository';
import { UpdateNeighborhoodDto } from '../dto/update-neighborhood.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdateNeighborhoodUseCase {
  constructor(
    @Inject(NEIGHBORHOOD_REPOSITORY)
    private readonly neighborhoodRepository: NeighborhoodRepository,
  ) {}

  async execute(id: string, dto: UpdateNeighborhoodDto) {
    try {
      const existing = await this.neighborhoodRepository.findById(id);
      if (!existing) {
        throw new NotFoundException(`Neighborhood with id '${id}' not found`);
      }

      return await this.neighborhoodRepository.update(id, dto as any);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'UpdateNeighborhoodUseCase');
    }
  }
}
