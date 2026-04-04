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
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateCountryUseCase } from '@application/location/use-cases/create-country.use-case';
import { GetCountriesUseCase } from '@application/location/use-cases/get-countries.use-case';
import { UpdateCountryUseCase } from '@application/location/use-cases/update-country.use-case';
import { DeleteCountryUseCase } from '@application/location/use-cases/delete-country.use-case';

import { CreateCityUseCase } from '@application/location/use-cases/create-city.use-case';
import { GetCitiesUseCase } from '@application/location/use-cases/get-cities.use-case';
import { UpdateCityUseCase } from '@application/location/use-cases/update-city.use-case';
import { DeleteCityUseCase } from '@application/location/use-cases/delete-city.use-case';

import { CreateNeighborhoodUseCase } from '@application/location/use-cases/create-neighborhood.use-case';
import { GetNeighborhoodsUseCase } from '@application/location/use-cases/get-neighborhoods.use-case';
import { UpdateNeighborhoodUseCase } from '@application/location/use-cases/update-neighborhood.use-case';
import { DeleteNeighborhoodUseCase } from '@application/location/use-cases/delete-neighborhood.use-case';

import { CreateCountryDto } from '@application/location/dto/create-country.dto';
import { UpdateCountryDto } from '@application/location/dto/update-country.dto';
import { CreateCityDto } from '@application/location/dto/create-city.dto';
import { UpdateCityDto } from '@application/location/dto/update-city.dto';
import { CreateNeighborhoodDto } from '@application/location/dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from '@application/location/dto/update-neighborhood.dto';
import {
  CountryResponseDto,
  CityResponseDto,
  NeighborhoodResponseDto,
} from '@application/location/dto/location-response.dto';
import { Auth } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly createCountryUseCase: CreateCountryUseCase,
    private readonly getCountriesUseCase: GetCountriesUseCase,
    private readonly updateCountryUseCase: UpdateCountryUseCase,
    private readonly deleteCountryUseCase: DeleteCountryUseCase,
    private readonly createCityUseCase: CreateCityUseCase,
    private readonly getCitiesUseCase: GetCitiesUseCase,
    private readonly updateCityUseCase: UpdateCityUseCase,
    private readonly deleteCityUseCase: DeleteCityUseCase,
    private readonly createNeighborhoodUseCase: CreateNeighborhoodUseCase,
    private readonly getNeighborhoodsUseCase: GetNeighborhoodsUseCase,
    private readonly updateNeighborhoodUseCase: UpdateNeighborhoodUseCase,
    private readonly deleteNeighborhoodUseCase: DeleteNeighborhoodUseCase,
  ) {}

  @Post('countries')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a country' })
  @ApiBody({ type: CreateCountryDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Country created',
    type: CountryResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input or country code already exists' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  createCountry(@Body() dto: CreateCountryDto) {
    return this.createCountryUseCase.execute(dto);
  }

  @Get('countries')
  @ApiOperation({ summary: 'Get all countries' })
  @ApiQuery({ name: 'onlyActive', required: false, type: Boolean })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of countries',
    type: [CountryResponseDto],
  })
  getCountries(@Query('onlyActive') onlyActive?: string) {
    return this.getCountriesUseCase.execute(onlyActive === 'true');
  }

  @Put('countries/:id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a country' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCountryDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Country updated',
    type: CountryResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Country not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  updateCountry(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCountryDto,
  ) {
    return this.updateCountryUseCase.execute(id, dto);
  }

  @Delete('countries/:id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a country' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Country deleted',
    schema: {
      properties: {
        message: { type: 'string', example: 'Country deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Country not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  deleteCountry(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteCountryUseCase.execute(id);
  }

  @Post('cities')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a city' })
  @ApiBody({ type: CreateCityDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'City created',
    type: CityResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  createCity(@Body() dto: CreateCityDto) {
    return this.createCityUseCase.execute(dto);
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get cities (optionally filter by country)' })
  @ApiQuery({ name: 'countryId', required: false, type: String })
  @ApiQuery({ name: 'onlyActive', required: false, type: Boolean })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of cities',
    type: [CityResponseDto],
  })
  getCities(
    @Query('countryId') countryId?: string,
    @Query('onlyActive') onlyActive?: string,
  ) {
    return this.getCitiesUseCase.execute(countryId, onlyActive === 'true');
  }

  @Put('cities/:id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a city' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCityDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'City updated',
    type: CityResponseDto,
  })
  @ApiNotFoundResponse({ description: 'City not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  updateCity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCityDto,
  ) {
    return this.updateCityUseCase.execute(id, dto);
  }

  @Delete('cities/:id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a city' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'City deleted',
    schema: {
      properties: {
        message: { type: 'string', example: 'City deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'City not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  deleteCity(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteCityUseCase.execute(id);
  }

  @Post('neighborhoods')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a neighborhood' })
  @ApiBody({ type: CreateNeighborhoodDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Neighborhood created',
    type: NeighborhoodResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  createNeighborhood(@Body() dto: CreateNeighborhoodDto) {
    return this.createNeighborhoodUseCase.execute(dto);
  }

  @Get('neighborhoods')
  @ApiOperation({ summary: 'Get neighborhoods (optionally filter by city)' })
  @ApiQuery({ name: 'cityId', required: false, type: String })
  @ApiQuery({ name: 'onlyActive', required: false, type: Boolean })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of neighborhoods',
    type: [NeighborhoodResponseDto],
  })
  getNeighborhoods(
    @Query('cityId') cityId?: string,
    @Query('onlyActive') onlyActive?: string,
  ) {
    return this.getNeighborhoodsUseCase.execute(cityId, onlyActive === 'true');
  }

  @Put('neighborhoods/:id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a neighborhood' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateNeighborhoodDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Neighborhood updated',
    type: NeighborhoodResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Neighborhood not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  updateNeighborhood(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNeighborhoodDto,
  ) {
    return this.updateNeighborhoodUseCase.execute(id, dto);
  }

  @Delete('neighborhoods/:id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a neighborhood' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Neighborhood deleted',
    schema: {
      properties: {
        message: { type: 'string', example: 'Neighborhood deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Neighborhood not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  deleteNeighborhood(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteNeighborhoodUseCase.execute(id);
  }
}
