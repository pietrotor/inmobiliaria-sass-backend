import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { S3Module } from '@infrastructure/storage/s3/s3.module';
import { FilesController } from './files.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    S3Module,
  ],
  controllers: [FilesController],
  exports: [S3Module],
})
export class FilesModule {}
