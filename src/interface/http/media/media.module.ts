import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { MediaController } from './media.controller';

import { UploadMediaUseCase } from '@application/media/use-cases/upload-media.use-case';
import { GetMediaByEntityUseCase } from '@application/media/use-cases/get-media-by-entity.use-case';
import { DeleteMediaUseCase } from '@application/media/use-cases/delete-media.use-case';
import { DeleteMediaByEntityUseCase } from '@application/media/use-cases/delete-media-by-entity.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleMediaRepository } from '@infrastructure/persistence/repositories/media.repository.impl';
import { S3Module } from '@infrastructure/storage/s3/s3.module';

import { MEDIA_REPOSITORY } from '@domain/media/repositories/media.repository';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    S3Module,
    UsersModule,
  ],
  controllers: [MediaController],
  providers: [
    UploadMediaUseCase,
    GetMediaByEntityUseCase,
    DeleteMediaUseCase,
    DeleteMediaByEntityUseCase,

    {
      provide: MEDIA_REPOSITORY,
      useClass: DrizzleMediaRepository,
    },
  ],
  exports: [
    MEDIA_REPOSITORY,
    UploadMediaUseCase,
    GetMediaByEntityUseCase,
    DeleteMediaUseCase,
    DeleteMediaByEntityUseCase,
  ],
})
export class MediaModule {}
