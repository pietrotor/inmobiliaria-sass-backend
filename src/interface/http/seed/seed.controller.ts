import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { SeedUsersUseCase } from '@application/user/use-cases/seed-users.use-case';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedUsersUseCase: SeedUsersUseCase) {}

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
}
