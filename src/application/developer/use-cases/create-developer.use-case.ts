import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  DeveloperRepository,
  DEVELOPER_REPOSITORY,
} from '@domain/developer/repositories/developer.repository';
import { CreateDeveloperDto } from '../dto/create-developer.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreateDeveloperUseCase {
  constructor(
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
  ) {}

  async execute(dto: CreateDeveloperDto) {
    try {
      const existing = await this.developerRepository.findByOrganizationId(
        dto.organizationId,
      );

      if (existing) {
        throw new BadRequestException(
          'This organization already has a developer profile',
        );
      }

      return await this.developerRepository.create({
        organizationId: dto.organizationId,
        name: dto.name,
        legalName: dto.legalName,
        taxId: dto.taxId,
        phone: dto.phone,
        email: dto.email,
      });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'CreateDeveloperUseCase');
    }
  }
}
