import {
  Inject,
  Injectable,
  NotFoundException,
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
  UnitRepository,
  UNIT_REPOSITORY,
} from '@domain/unit/repositories/unit.repository';
import {
  UnitPriceHistoryRepository,
  UNIT_PRICE_HISTORY_REPOSITORY,
} from '@domain/unit/repositories/unit-price-history.repository';
import {
  MediaRepository,
  MEDIA_REPOSITORY,
} from '@domain/media/repositories/media.repository';
import { UpdateUnitPriceDto } from '../dto/update-unit-price.dto';
import { enrichUnitWithMedia } from '../helpers/enrich-unit.helper';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdateUnitPriceUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(DEVELOPER_REPOSITORY)
    private readonly developerRepository: DeveloperRepository,
    @Inject(UNIT_REPOSITORY)
    private readonly unitRepository: UnitRepository,
    @Inject(UNIT_PRICE_HISTORY_REPOSITORY)
    private readonly priceHistoryRepository: UnitPriceHistoryRepository,
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
  ) {}

  async execute(
    organizationId: string,
    userId: string,
    projectId: string,
    unitId: string,
    dto: UpdateUnitPriceDto,
  ) {
    try {
      const developer =
        await this.developerRepository.findByOrganizationId(organizationId);

      if (!developer) {
        throw new NotFoundException(
          'Developer profile not found for this organization',
        );
      }

      const project = await this.projectRepository.findById(projectId);

      if (!project) {
        throw new NotFoundException(
          `Project with identifier '${projectId}' not found`,
        );
      }

      if (project.developerId !== developer.id) {
        throw new ForbiddenException(
          'You do not have access to this project',
        );
      }

      const unit = await this.unitRepository.findById(unitId);

      if (!unit || unit.projectId !== projectId) {
        throw new NotFoundException(
          `Unit with identifier '${unitId}' not found in this project`,
        );
      }

      await this.priceHistoryRepository.create({
        unitId,
        previousPriceUSD: unit.priceUSD,
        newPriceUSD: dto.newPriceUSD,
        changedByUserId: userId,
        reason: dto.reason ?? 'Price updated',
      });

      const updated = await this.unitRepository.update(unitId, {
        priceUSD: dto.newPriceUSD,
      } as any);

      return enrichUnitWithMedia(this.mediaRepository, updated);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'UpdateUnitPriceUseCase');
    }
  }
}
