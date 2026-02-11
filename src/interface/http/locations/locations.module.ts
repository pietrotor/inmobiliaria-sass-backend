import { Module } from '@nestjs/common';

// Controller
import { LocationsController } from './locations.controller';

// Use Cases - Country
import { CreateCountryUseCase } from '@application/location/use-cases/create-country.use-case';
import { GetCountriesUseCase } from '@application/location/use-cases/get-countries.use-case';
import { UpdateCountryUseCase } from '@application/location/use-cases/update-country.use-case';
import { DeleteCountryUseCase } from '@application/location/use-cases/delete-country.use-case';

// Use Cases - City
import { CreateCityUseCase } from '@application/location/use-cases/create-city.use-case';
import { GetCitiesUseCase } from '@application/location/use-cases/get-cities.use-case';
import { UpdateCityUseCase } from '@application/location/use-cases/update-city.use-case';
import { DeleteCityUseCase } from '@application/location/use-cases/delete-city.use-case';

// Use Cases - Neighborhood
import { CreateNeighborhoodUseCase } from '@application/location/use-cases/create-neighborhood.use-case';
import { GetNeighborhoodsUseCase } from '@application/location/use-cases/get-neighborhoods.use-case';
import { UpdateNeighborhoodUseCase } from '@application/location/use-cases/update-neighborhood.use-case';
import { DeleteNeighborhoodUseCase } from '@application/location/use-cases/delete-neighborhood.use-case';

// Infrastructure
import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleCountryRepository } from '@infrastructure/persistence/repositories/country.repository.impl';
import { DrizzleCityRepository } from '@infrastructure/persistence/repositories/city.repository.impl';
import { DrizzleNeighborhoodRepository } from '@infrastructure/persistence/repositories/neighborhood.repository.impl';

// Domain
import { COUNTRY_REPOSITORY } from '@domain/location/repositories/country.repository';
import { CITY_REPOSITORY } from '@domain/location/repositories/city.repository';
import { NEIGHBORHOOD_REPOSITORY } from '@domain/location/repositories/neighborhood.repository';

// Import UsersModule for authentication
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DrizzleModule, UsersModule],
  controllers: [LocationsController],
  providers: [
    // Use Cases
    CreateCountryUseCase,
    GetCountriesUseCase,
    UpdateCountryUseCase,
    DeleteCountryUseCase,
    CreateCityUseCase,
    GetCitiesUseCase,
    UpdateCityUseCase,
    DeleteCityUseCase,
    CreateNeighborhoodUseCase,
    GetNeighborhoodsUseCase,
    UpdateNeighborhoodUseCase,
    DeleteNeighborhoodUseCase,

    // Repository Implementations
    {
      provide: COUNTRY_REPOSITORY,
      useClass: DrizzleCountryRepository,
    },
    {
      provide: CITY_REPOSITORY,
      useClass: DrizzleCityRepository,
    },
    {
      provide: NEIGHBORHOOD_REPOSITORY,
      useClass: DrizzleNeighborhoodRepository,
    },
  ],
  exports: [COUNTRY_REPOSITORY, CITY_REPOSITORY, NEIGHBORHOOD_REPOSITORY],
})
export class LocationsModule {}
