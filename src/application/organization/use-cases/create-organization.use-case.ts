import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  OrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from '@domain/organization/repositories/organization.repository';
import { Organization } from '@domain/organization/entities/organization.entity';
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

      // Generate slug from name
      let slug = Organization.generateSlug(createOrganizationDto.name);

      // Ensure slug uniqueness
      const existingSlug =
        await this.organizationRepository.findBySlug(slug);
      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }

      const organization = await this.organizationRepository.create({
        ...createOrganizationDto,
        slug,
        isActive: true,
        deleted: false,
      });

      return organization;
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'CreateOrganizationUseCase');
    }
  }
}
