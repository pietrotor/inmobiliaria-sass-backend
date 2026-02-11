import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  OrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from '@domain/organization/repositories/organization.repository';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(createOrganizationDto: CreateOrganizationDto) {
    try {
      // Check if organization with email already exists
      const existingOrganization =
        await this.organizationRepository.findByEmail(
          createOrganizationDto.email,
        );

      if (existingOrganization) {
        throw new BadRequestException('Organization email already exists');
      }

      const organization = await this.organizationRepository.create({
        ...createOrganizationDto,
        isActive: true,
        deleted: false,
      });

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
      DatabaseErrorHandler.handle(error, 'CreateOrganizationUseCase');
    }
  }
}
