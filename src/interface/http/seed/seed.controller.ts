import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { SeedUsersUseCase } from '@application/user/use-cases/seed-users.use-case';
import { Auth } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedUseCase: SeedUsersUseCase) {}

  @Get()
  @Auth(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Seed entire database',
    description:
      'Deletes all data and recreates organizations, users, countries, cities, developers, projects, and media from seed data. SUPER_ADMIN only.',
  })
  @ApiResponse({ status: 200, description: 'Database seeded successfully' })
  executeSeed() {
    return this.seedUseCase.execute();
  }
}
