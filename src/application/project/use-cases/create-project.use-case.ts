import {
  Inject,
  Injectable,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import {
  ProjectRepository,
  PROJECT_REPOSITORY,
} from '@domain/project/repositories/project.repository';
import {
  DeveloperRepository,
  DEVELOPER_REPOSITORY,
} from '@domain/developer/repositories/developer.repository';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import { ProjectStatus } from '@domain/project/value-objects/project-status.vo';
import { ProjectVisibility } from '@domain/project/value-objects/project-visibility.vo';
import { CreateProjectDto } from '../dto/create-project.dto';
import { enrichProjectWithMedia } from '../helpers/enrich-project.helper';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
  ) {}

  async execute(organizationId: string, dto: CreateProjectDto) {
    try {
      const developer =
        await this.developerRepository.findByOrganizationId(organizationId);

      if (!developer) {
        throw new NotFoundException(
          'Developer profile not found for this organization',
        );
      }

      const project = await this.projectRepository.create({
        developerId: developer.id,
        name: dto.name,
        description: dto.description ?? null,
        address: dto.address,
        countryId: dto.countryId,
        cityId: dto.cityId,
        neighborhoodId: dto.neighborhoodId,
        status: ProjectStatus.DRAFT,
        visibility: dto.visibility ?? ProjectVisibility.PUBLIC,
        deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
        totalFloors: dto.totalFloors ?? null,
        totalUnits: dto.totalUnits,
        amenities: dto.amenities ?? [],
        defaultCommissionPct: dto.defaultCommissionPct,
        intentDeadlineHours: dto.intentDeadlineHours ?? 48,
      });

      return enrichProjectWithMedia(this.mediaRepository, project);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'CreateProjectUseCase');
    }
  }
}
