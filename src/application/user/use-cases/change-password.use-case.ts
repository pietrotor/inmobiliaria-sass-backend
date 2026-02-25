import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  UserRepository,
  USER_REPOSITORY,
} from '@domain/user/repositories/user.repository';
import { BcryptService } from '@infrastructure/auth/bcrypt/bcrypt.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(userId: string, dto: ChangePasswordDto) {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await this.bcryptService.compare(
        dto.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      // Hash and save new password
      const hashedPassword = await this.bcryptService.hash(dto.newPassword);

      await this.userRepository.update(userId, {
        password: hashedPassword,
      } as any);

      return { message: 'Password changed successfully' };
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'ChangePasswordUseCase');
    }
  }
}
