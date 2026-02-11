import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository, USER_REPOSITORY } from '@domain/user/repositories/user.repository';
import { Role } from '@domain/user/value-objects/role.vo';
import { BcryptService } from '@infrastructure/auth/bcrypt/bcrypt.service';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: CreateUserDto) {
    try {
      const hashedPassword = this.bcryptService.hashSync(dto.password);

      const user = await this.userRepository.create({
        name: dto.name,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        password: hashedPassword,
        roles: [Role.USER],
        organizationId: dto.organizationId,
        isActive: true,
        deleted: false,
      });

      const { password, ...userWithoutPassword } = user;

      return {
        ...userWithoutPassword,
        token: this.jwtService.sign({ id: user.id }),
      };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'CreateUserUseCase');
    }
  }
}
