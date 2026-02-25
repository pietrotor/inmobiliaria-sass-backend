import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SeedUsersUseCase } from '@application/user/use-cases/seed-users.use-case';
import { SeedPropertiesUseCase } from '@application/property/use-cases/seed-properties.use-case';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedUsersUseCase: SeedUsersUseCase,
    private readonly seedPropertiesUseCase: SeedPropertiesUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Seed users and organizations',
    description:
      'Deletes all users/organizations and recreates from seed data.',
  })
  // @Auth(ValidRoles.ADMIN)
  executeSeed() {
    return this.seedUsersUseCase.execute();
  }

  @Get('properties')
  @ApiOperation({
    summary: 'Seed locations and properties',
    description:
      'Creates countries, cities, neighborhoods, and sample properties with images and multi-currency prices. Requires organizations to exist (run GET /seed first).',
  })
  @ApiResponse({
    status: 200,
    description: 'Properties and locations seeded successfully',
    schema: {
      example: {
        message: 'Properties seed completed successfully',
        organization: 'Trackio Organization',
        locations: { countries: 13, cities: 50, neighborhoods: 87 },
        properties: 12,
      },
    },
  })
  seedProperties() {
    return this.seedPropertiesUseCase.execute();
  }

  @Get('all')
  @ApiOperation({
    summary: 'Seed everything',
    description:
      'Runs all seeds in order: users/organizations → locations → properties.',
  })
  async seedAll() {
    const usersResult = await this.seedUsersUseCase.execute();
    const propertiesResult = await this.seedPropertiesUseCase.execute();

    return {
      message: 'Full database seed completed',
      users: usersResult,
      properties: propertiesResult,
    };
  }
}
