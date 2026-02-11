import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@domain/user/entities/user.entity';

@Injectable()
export class CheckAuthStatusUseCase {
  constructor(private readonly jwtService: JwtService) {}

  execute(user: User) {
    return {
      ...user,
      token: this.jwtService.sign({ id: user.id }),
    };
  }
}
