import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  OrganizationRepository,
  ORGANIZATION_REPOSITORY,
} from '@domain/organization/repositories/organization.repository';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    try {
      const organization = await this.organizationRepository.findById(id);

      if (!organization) {
        throw new NotFoundException(
          `Organization with identifier '${id}' not found`,
        );
      }

      // Check if email is being updated and if it already exists
      if (
        updateOrganizationDto.email &&
        updateOrganizationDto.email !== organization.email
      ) {
        const existingOrganization =
          await this.organizationRepository.findByEmail(
            updateOrganizationDto.email,
          );

        if (existingOrganization) {
          throw new BadRequestException('Organization email already exists');
        }
      }

      const updatedOrganization = await this.organizationRepository.update(
        id,
        updateOrganizationDto,
      );

      return {
        id: updatedOrganization.id,
        name: updatedOrganization.name,
        email: updatedOrganization.email,
        phone: updatedOrganization.phone,
        address: updatedOrganization.address,
        isActive: updatedOrganization.isActive,
        createdAt: updatedOrganization.createdAt,
        updatedAt: updatedOrganization.updatedAt,
      };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'UpdateOrganizationUseCase');
    }
  }
}
