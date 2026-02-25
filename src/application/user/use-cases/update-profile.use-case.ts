import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  UserRepository,
  USER_REPOSITORY,
} from '@domain/user/repositories/user.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, dto: UpdateProfileDto) {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = await this.userRepository.update(userId, {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.phoneNumber !== undefined && {
          phoneNumber: dto.phoneNumber,
        }),
      });

      return updatedUser.withoutPassword();
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'UpdateProfileUseCase');
    }
  }
}
