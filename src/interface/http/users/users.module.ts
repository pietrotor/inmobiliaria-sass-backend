import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Controllers
import { UsersController } from './users.controller';

// Use Cases
import { CreateUserUseCase } from '@application/user/use-cases/create-user.use-case';
import { LoginUserUseCase } from '@application/user/use-cases/login-user.use-case';
import { CheckAuthStatusUseCase } from '@application/user/use-cases/check-auth-status.use-case';

// Infrastructure
import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleUserRepository } from '@infrastructure/persistence/repositories/user.repository.impl';
import { BcryptService } from '@infrastructure/auth/bcrypt/bcrypt.service';
import { JwtStrategy } from '@infrastructure/auth/jwt/jwt.strategy';

// Domain
import { USER_REPOSITORY } from '@domain/user/repositories/user.repository';

// Guards
import { UserRoleGuard } from '@interface/http/common';

@Module({
  imports: [
    ConfigModule,
    DrizzleModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '160h' },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    LoginUserUseCase,
    CheckAuthStatusUseCase,

    // Infrastructure Services
    BcryptService,
    JwtStrategy,

    // Guards
    UserRoleGuard,

    // Repository Implementations (Dependency Injection)
    {
      provide: USER_REPOSITORY,
      useClass: DrizzleUserRepository,
    },
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    JwtModule,
    USER_REPOSITORY,
    BcryptService,
  ],
})
export class UsersModule {}
