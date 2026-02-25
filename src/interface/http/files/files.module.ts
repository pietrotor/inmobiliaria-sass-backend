import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { S3Module } from '@infrastructure/storage/s3/s3.module';
import { FilesController } from './files.controller';
import { GenerateUploadUrlUseCase } from '@application/common/use-cases/generate-upload-url.use-case';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    S3Module,
  ],
  controllers: [FilesController],
  providers: [GenerateUploadUrlUseCase],
  exports: [S3Module],
})
export class FilesModule {}
