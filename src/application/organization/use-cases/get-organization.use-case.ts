import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  OrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from '@domain/organization/repositories/organization.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetOrganizationUseCase {
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

      return {
        id: organization.id,
        name: organization.name,
        email: organization.email,
        phone: organization.phone,
        address: organization.address,
        isActive: organization.isActive,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
      };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GetOrganizationUseCase');
    }
  }
}
