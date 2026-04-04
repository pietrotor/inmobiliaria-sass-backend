import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

// Infrastructure
import { DrizzleModule } from './infrastructure/persistence/drizzle/drizzle.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { NotificationsModule } from './infrastructure/notifications/notifications.module';
import { BusinessHoursModule } from './infrastructure/business-hours/business-hours.module';

// Interface (HTTP Controllers)
import { UsersModule } from './interface/http/users/users.module';
import { SeedModule } from './interface/http/seed/seed.module';
import { OrganizationsModule } from './interface/http/organizations/organizations.module';
import { LocationsModule } from './interface/http/locations/locations.module';
import { DevelopersModule } from './interface/http/developers/developers.module';
import { ProjectsModule } from './interface/http/projects/projects.module';
import { FilesModule } from './interface/http/files/files.module';
import { UnitsModule } from './interface/http/units/units.module';
import { MediaModule } from './interface/http/media/media.module';
import { BrokersModule } from './interface/http/brokers/brokers.module';
import { MarketplaceModule } from './interface/http/marketplace/marketplace.module';
import { LeadsModule } from './interface/http/leads/leads.module';
import { ReservationsModule } from './interface/http/reservations/reservations.module';
import { PaymentsModule } from './interface/http/payments/payments.module';
import { CommissionsModule } from './interface/http/commissions/commissions.module';
import { PostSaleModule } from './interface/http/post-sale/post-sale.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    // Infrastructure Layer
    LoggerModule,
    DrizzleModule,
    NotificationsModule,
    BusinessHoursModule,

    // Interface Layer (HTTP)
    UsersModule,
    SeedModule,
    OrganizationsModule,
    LocationsModule,
    DevelopersModule,
    ProjectsModule,
    FilesModule,
    UnitsModule,
    MediaModule,
    BrokersModule,
    LeadsModule,
    MarketplaceModule,
    ReservationsModule,
    PaymentsModule,
    CommissionsModule,
    PostSaleModule,
  ],
})
export class AppModule {}
