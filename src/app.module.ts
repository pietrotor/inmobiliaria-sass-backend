import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

// Infrastructure
import { DrizzleModule } from './infrastructure/persistence/drizzle/drizzle.module';
import { LoggerModule } from './infrastructure/logger/logger.module';

// Interface (HTTP Controllers)
import { UsersModule } from './interface/http/users/users.module';
import { SeedModule } from './interface/http/seed/seed.module';
import { OrganizationsModule } from './interface/http/organizations/organizations.module';
import { PropertiesModule } from './interface/http/properties/properties.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    // Infrastructure Layer
    LoggerModule,
    DrizzleModule,

    // Interface Layer (HTTP)
    UsersModule,
    SeedModule,
    OrganizationsModule,
    PropertiesModule,
  ],
})
export class AppModule {}
