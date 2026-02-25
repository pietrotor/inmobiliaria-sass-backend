import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
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
import { UpdateProjectDto } from '../dto/update-project.dto';
import { enrichProjectWithMedia } from '../helpers/enrich-project.helper';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
  ) {}

  async execute(organizationId: string, id: string, dto: UpdateProjectDto) {
    try {
      const developer =
        await this.developerRepository.findByOrganizationId(organizationId);

      if (!developer) {
        throw new NotFoundException(
          'Developer profile not found for this organization',
        );
      }

      const project = await this.projectRepository.findById(id);

      if (!project) {
        throw new NotFoundException(
          `Project with identifier '${id}' not found`,
        );
      }

      if (project.developerId !== developer.id) {
        throw new ForbiddenException(
          'You do not have access to this project',
        );
      }

      if (project.isClosed()) {
        throw new BadRequestException(
          'Cannot update a closed project. CLOSED is a terminal state.',
        );
      }

      const updateData: Record<string, unknown> = {};

      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.description !== undefined)
        updateData.description = dto.description;
      if (dto.address !== undefined) updateData.address = dto.address;
      if (dto.countryId !== undefined) updateData.countryId = dto.countryId;
      if (dto.cityId !== undefined) updateData.cityId = dto.cityId;
      if (dto.neighborhoodId !== undefined)
        updateData.neighborhoodId = dto.neighborhoodId;
      if (dto.visibility !== undefined) updateData.visibility = dto.visibility;
      if (dto.deliveryDate !== undefined)
        updateData.deliveryDate = dto.deliveryDate
          ? new Date(dto.deliveryDate)
          : null;
      if (dto.totalFloors !== undefined)
        updateData.totalFloors = dto.totalFloors;
      if (dto.totalUnits !== undefined) updateData.totalUnits = dto.totalUnits;
      if (dto.amenities !== undefined) updateData.amenities = dto.amenities;
      if (dto.defaultCommissionPct !== undefined)
        updateData.defaultCommissionPct = dto.defaultCommissionPct;
      if (dto.intentDeadlineHours !== undefined)
        updateData.intentDeadlineHours = dto.intentDeadlineHours;

      const updated = await this.projectRepository.update(id, updateData as any);

      return enrichProjectWithMedia(this.mediaRepository, updated);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'UpdateProjectUseCase');
    }
  }
}
