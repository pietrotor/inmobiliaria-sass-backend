import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ProjectsController } from './projects.controller';

import { CreateProjectUseCase } from '@application/project/use-cases/create-project.use-case';
import { GetProjectUseCase } from '@application/project/use-cases/get-project.use-case';
import { GetProjectsUseCase } from '@application/project/use-cases/get-projects.use-case';
import { GetPublishedProjectsUseCase } from '@application/project/use-cases/get-published-projects.use-case';
import { UpdateProjectUseCase } from '@application/project/use-cases/update-project.use-case';
import { ChangeProjectStatusUseCase } from '@application/project/use-cases/change-project-status.use-case';
import { DeleteProjectUseCase } from '@application/project/use-cases/delete-project.use-case';
import { UploadProjectMediaUseCase } from '@application/project/use-cases/upload-project-media.use-case';
import { DeleteProjectMediaUseCase } from '@application/project/use-cases/delete-project-media.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzleProjectRepository } from '@infrastructure/persistence/repositories/project.repository.impl';

import { PROJECT_REPOSITORY } from '@domain/project/repositories/project.repository';

import { UsersModule } from '../users/users.module';
import { DevelopersModule } from '../developers/developers.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    UsersModule,
    DevelopersModule,
    MediaModule,
  ],
  controllers: [ProjectsController],
  providers: [
    CreateProjectUseCase,
    GetProjectUseCase,
    GetProjectsUseCase,
    GetPublishedProjectsUseCase,
    UpdateProjectUseCase,
    ChangeProjectStatusUseCase,
    DeleteProjectUseCase,
    UploadProjectMediaUseCase,
    DeleteProjectMediaUseCase,

    {
      provide: PROJECT_REPOSITORY,
      useClass: DrizzleProjectRepository,
    },
  ],
  exports: [PROJECT_REPOSITORY],
})
export class ProjectsModule {}
