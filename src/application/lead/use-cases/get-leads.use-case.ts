import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  LEAD_REPOSITORY,
  LeadRepository,
  LeadFilters,
} from '@domain/lead/repositories/lead.repository';
import {
  DEVELOPER_REPOSITORY,
  DeveloperRepository,
} from '@domain/developer/repositories/developer.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetLeadsUseCase {
  constructor(
    @Inject(LEAD_REPOSITORY)
    private readonly leadRepository: LeadRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
  ) {}

  async execute(
    organizationId: string,
    limit: number,
    offset: number,
    filters?: LeadFilters,
  ) {
    try {
      const developer =
        await this.developerRepository.findByOrganizationId(organizationId);
      if (!developer)
        throw new NotFoundException('Developer profile not found');

      return await this.leadRepository.findByDeveloperId(
        developer.id,
        limit,
        offset,
        filters,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GetLeadsUseCase');
    }
  }
}
