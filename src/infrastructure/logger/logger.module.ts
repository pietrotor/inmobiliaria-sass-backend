import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './winston.config';
import { AppLoggerService } from './logger.service';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
  ],
  providers: [AppLoggerService, DatabaseErrorHandler],
  exports: [WinstonModule, AppLoggerService, DatabaseErrorHandler],
})
export class LoggerModule {}
