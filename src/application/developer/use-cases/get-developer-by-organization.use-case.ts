import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DeveloperRepository,
  DEVELOPER_REPOSITORY,
} from '@domain/developer/repositories/developer.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetDeveloperByOrganizationUseCase {
  constructor(
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
  ) {}

  async execute(organizationId: string) {
    try {
      const developer =
        await this.developerRepository.findByOrganizationId(organizationId);

      if (!developer) {
        throw new NotFoundException(
          `Developer profile for organization '${organizationId}' not found`,
        );
      }

      return developer;
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GetDeveloperByOrganizationUseCase');
    }
  }
}
