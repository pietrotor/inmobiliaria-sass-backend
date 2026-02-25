import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DeveloperRepository,
  DEVELOPER_REPOSITORY,
} from '@domain/developer/repositories/developer.repository';
import { UpdateDeveloperDto } from '../dto/update-developer.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdateDeveloperUseCase {
  constructor(
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
  ) {}

  async execute(id: string, dto: UpdateDeveloperDto) {
    try {
      const developer = await this.developerRepository.findById(id);

      if (!developer) {
        throw new NotFoundException(
          `Developer with identifier '${id}' not found`,
        );
      }

      const updateData: Record<string, unknown> = {};

      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.legalName !== undefined) updateData.legalName = dto.legalName;
      if (dto.taxId !== undefined) updateData.taxId = dto.taxId;
      if (dto.phone !== undefined) updateData.phone = dto.phone;
      if (dto.email !== undefined) updateData.email = dto.email;

      return await this.developerRepository.update(id, updateData as any);
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'UpdateDeveloperUseCase');
    }
  }
}
