import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  PropertyRepository,
  PROPERTY_REPOSITORY,
} from '@domain/property/repositories/property.repository';
import {
  AiSearchParserService,
  AI_SEARCH_PARSER,
  LocationContext,
} from '@domain/common/services/ai-search-parser.service';
import {
  CountryRepository,
  COUNTRY_REPOSITORY,
} from '@domain/location/repositories/country.repository';
import {
  CityRepository,
  CITY_REPOSITORY,
} from '@domain/location/repositories/city.repository';
import {
  NeighborhoodRepository,
  NEIGHBORHOOD_REPOSITORY,
} from '@domain/location/repositories/neighborhood.repository';

import { AiSearchDto } from '../dto/ai-search.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class AiSearchPropertiesUseCase {
  private readonly logger = new Logger(AiSearchPropertiesUseCase.name);

  constructor(
    @Inject(AI_SEARCH_PARSER)
    private readonly aiParser: AiSearchParserService,
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: PropertyRepository,
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(CITY_REPOSITORY)
    private readonly cityRepository: CityRepository,
    @Inject(NEIGHBORHOOD_REPOSITORY)
    private readonly neighborhoodRepository: NeighborhoodRepository,
  ) {}

  async execute(dto: AiSearchDto) {
    try {
      // 1. Build location context from DB (active locations only)
      const locationContext = await this.buildLocationContext();

      // 2. Parse natural language → structured filters via AI
      const parsedFilters = await this.aiParser.parseSearchQuery(
        dto.query,
        locationContext,
      );

      this.logger.log(
        `AI parsed "${dto.query}" → ${JSON.stringify(parsedFilters)}`,
      );

      // 3. Merge AI filters with pagination
      const filters = {
        ...parsedFilters,
        isPublished: true, // AI search is public-facing
        page: dto.page || 1,
        limit: dto.limit || 20,
      };

      // 4. Execute search with existing repository
      const results = await this.propertyRepository.findAll(filters as any);

      // 5. Return results + the parsed filters for frontend transparency
      return {
        originalQuery: dto.query,
        parsedFilters,
        ...results,
      };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'AiSearchPropertiesUseCase');
    }
  }

  private async buildLocationContext(): Promise<LocationContext> {
    const [countries, cities, neighborhoods] = await Promise.all([
      this.countryRepository.findAll(true),
      this.cityRepository.findAll(true),
      this.neighborhoodRepository.findAll(true),
    ]);

    return {
      countries: countries.map((c) => ({
        id: c.id,
        name: c.name,
        code: c.code,
      })),
      cities: cities.map((c) => ({
        id: c.id,
        name: c.name,
        countryId: c.countryId,
      })),
      neighborhoods: neighborhoods.map((n) => ({
        id: n.id,
        name: n.name,
        cityId: n.cityId,
      })),
    };
  }
}
