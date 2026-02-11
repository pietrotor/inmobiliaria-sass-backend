import { Inject, Injectable } from '@nestjs/common';
import {
  OrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from '@domain/organization/repositories/organization.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetOrganizationsUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute() {
    try {
      const organizations = await this.organizationRepository.findAll();

      return organizations.map((org) => ({
        id: org.id,
        name: org.name,
        email: org.email,
        phone: org.phone,
        address: org.address,
        isActive: org.isActive,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
      }));
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'GetOrganizationsUseCase');
    }
  }
}
