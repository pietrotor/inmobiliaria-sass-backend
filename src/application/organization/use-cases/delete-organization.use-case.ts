import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  OrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from '@domain/organization/repositories/organization.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(id: string) {
    try {
      const organization = await this.organizationRepository.findById(id);

      if (!organization) {
        throw new NotFoundException(
          `Organization with identifier '${id}' not found`,
        );
      }

      await this.organizationRepository.delete(id);

      return {
        message: 'Organization deleted successfully',
      };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'DeleteOrganizationUseCase');
    }
  }
}
