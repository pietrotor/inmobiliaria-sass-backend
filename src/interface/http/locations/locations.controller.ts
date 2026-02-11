import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

// Country use cases
import { CreateCountryUseCase } from '@application/location/use-cases/create-country.use-case';
import { GetCountriesUseCase } from '@application/location/use-cases/get-countries.use-case';
import { UpdateCountryUseCase } from '@application/location/use-cases/update-country.use-case';
import { DeleteCountryUseCase } from '@application/location/use-cases/delete-country.use-case';

// City use cases
import { CreateCityUseCase } from '@application/location/use-cases/create-city.use-case';
import { GetCitiesUseCase } from '@application/location/use-cases/get-cities.use-case';
import { UpdateCityUseCase } from '@application/location/use-cases/update-city.use-case';
import { DeleteCityUseCase } from '@application/location/use-cases/delete-city.use-case';

// Neighborhood use cases
import { CreateNeighborhoodUseCase } from '@application/location/use-cases/create-neighborhood.use-case';
import { GetNeighborhoodsUseCase } from '@application/location/use-cases/get-neighborhoods.use-case';
import { UpdateNeighborhoodUseCase } from '@application/location/use-cases/update-neighborhood.use-case';
import { DeleteNeighborhoodUseCase } from '@application/location/use-cases/delete-neighborhood.use-case';

// DTOs
import { CreateCountryDto } from '@application/location/dto/create-country.dto';
import { UpdateCountryDto } from '@application/location/dto/update-country.dto';
import { CreateCityDto } from '@application/location/dto/create-city.dto';
import { UpdateCityDto } from '@application/location/dto/update-city.dto';
import { CreateNeighborhoodDto } from '@application/location/dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from '@application/location/dto/update-neighborhood.dto';

import { Auth } from '@interface/http/common';
import { Role } from '@domain/user/value-objects/role.vo';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(
    // Country
    private readonly createCountryUseCase: CreateCountryUseCase,
    private readonly getCountriesUseCase: GetCountriesUseCase,
    private readonly updateCountryUseCase: UpdateCountryUseCase,
    private readonly deleteCountryUseCase: DeleteCountryUseCase,
    // City
    private readonly createCityUseCase: CreateCityUseCase,
    private readonly getCitiesUseCase: GetCitiesUseCase,
    private readonly updateCityUseCase: UpdateCityUseCase,
    private readonly deleteCityUseCase: DeleteCityUseCase,
    // Neighborhood
    private readonly createNeighborhoodUseCase: CreateNeighborhoodUseCase,
    private readonly getNeighborhoodsUseCase: GetNeighborhoodsUseCase,
    private readonly updateNeighborhoodUseCase: UpdateNeighborhoodUseCase,
    private readonly deleteNeighborhoodUseCase: DeleteNeighborhoodUseCase,
  ) {}

  // ── Countries ───────────────────────────────────────────────────────

  @Post('countries')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a country' })
  @ApiResponse({ status: 201, description: 'Country created' })
  createCountry(@Body() dto: CreateCountryDto) {
    return this.createCountryUseCase.execute(dto);
  }

  @Get('countries')
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({ status: 200, description: 'List of countries' })
  @ApiQuery({
    name: 'onlyActive',
    required: false,
    type: Boolean,
    description: 'Only return active countries',
  })
  getCountries(@Query('onlyActive') onlyActive?: string) {
    return this.getCountriesUseCase.execute(onlyActive === 'true');
  }

  @Put('countries/:id')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a country' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Country updated' })
  updateCountry(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCountryDto,
  ) {
    return this.updateCountryUseCase.execute(id, dto);
  }

  @Delete('countries/:id')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a country' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Country deleted' })
  deleteCountry(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteCountryUseCase.execute(id);
  }

  // ── Cities ──────────────────────────────────────────────────────────

  @Post('cities')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a city' })
  @ApiResponse({ status: 201, description: 'City created' })
  createCity(@Body() dto: CreateCityDto) {
    return this.createCityUseCase.execute(dto);
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get cities (optionally filter by country)' })
  @ApiResponse({ status: 200, description: 'List of cities' })
  @ApiQuery({
    name: 'countryId',
    required: false,
    type: String,
    description: 'Filter by country ID',
  })
  @ApiQuery({
    name: 'onlyActive',
    required: false,
    type: Boolean,
    description: 'Only return active cities',
  })
  getCities(
    @Query('countryId') countryId?: string,
    @Query('onlyActive') onlyActive?: string,
  ) {
    return this.getCitiesUseCase.execute(countryId, onlyActive === 'true');
  }

  @Put('cities/:id')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a city' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'City updated' })
  updateCity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCityDto,
  ) {
    return this.updateCityUseCase.execute(id, dto);
  }

  @Delete('cities/:id')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a city' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'City deleted' })
  deleteCity(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteCityUseCase.execute(id);
  }

  // ── Neighborhoods ───────────────────────────────────────────────────

  @Post('neighborhoods')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a neighborhood' })
  @ApiResponse({ status: 201, description: 'Neighborhood created' })
  createNeighborhood(@Body() dto: CreateNeighborhoodDto) {
    return this.createNeighborhoodUseCase.execute(dto);
  }

  @Get('neighborhoods')
  @ApiOperation({
    summary: 'Get neighborhoods (optionally filter by city)',
  })
  @ApiResponse({ status: 200, description: 'List of neighborhoods' })
  @ApiQuery({
    name: 'cityId',
    required: false,
    type: String,
    description: 'Filter by city ID',
  })
  @ApiQuery({
    name: 'onlyActive',
    required: false,
    type: Boolean,
    description: 'Only return active neighborhoods',
  })
  getNeighborhoods(
    @Query('cityId') cityId?: string,
    @Query('onlyActive') onlyActive?: string,
  ) {
    return this.getNeighborhoodsUseCase.execute(cityId, onlyActive === 'true');
  }

  @Put('neighborhoods/:id')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a neighborhood' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Neighborhood updated' })
  updateNeighborhood(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNeighborhoodDto,
  ) {
    return this.updateNeighborhoodUseCase.execute(id, dto);
  }

  @Delete('neighborhoods/:id')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a neighborhood' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Neighborhood deleted' })
  deleteNeighborhood(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteNeighborhoodUseCase.execute(id);
  }
}
