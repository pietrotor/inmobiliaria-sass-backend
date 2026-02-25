import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DeveloperRepository,
  DEVELOPER_REPOSITORY,
} from '@domain/developer/repositories/developer.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetDeveloperUseCase {
  constructor(
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
  ) {}

  async execute(id: string) {
    try {
      const developer = await this.developerRepository.findById(id);

      if (!developer) {
        throw new NotFoundException(
          `Developer with identifier '${id}' not found`,
        );
      }

      return developer;
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GetDeveloperUseCase');
    }
  }
}
