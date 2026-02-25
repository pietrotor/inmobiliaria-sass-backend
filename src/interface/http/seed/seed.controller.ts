import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SeedUsersUseCase } from '@application/user/use-cases/seed-users.use-case';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedUseCase: SeedUsersUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Seed entire database',
    description:
      'Deletes all data and recreates organizations, users, countries, cities, developers, projects, and media from seed data.',
  })
  @ApiResponse({ status: 200, description: 'Database seeded successfully' })
  executeSeed() {
    return this.seedUseCase.execute();
  }
}
