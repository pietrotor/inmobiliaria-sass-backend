import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SeedUsersUseCase } from '@application/user/use-cases/seed-users.use-case';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedUsersUseCase: SeedUsersUseCase) {}

  @Get()
  // @Auth(ValidRoles.ADMIN)
  executeSeed() {
    return this.seedUsersUseCase.execute();
  }
}
