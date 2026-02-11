import { Injectable, Inject, LoggerService as NestLoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

/**
 * Custom Logger Service
 * Wrapper around Winston logger for easier use throughout the application
 */
@Injectable()
export class AppLoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  /**
   * Log database errors with structured data
   */
  logDatabaseError(error: any, context: string) {
    this.logger.error('Database error', {
      context,
      code: error.code,
      message: error.message,
      detail: error.detail,
      stack: error.stack,
    });
  }

  /**
   * Log HTTP requests
   */
  logRequest(method: string, url: string, statusCode: number, context?: string) {
    this.logger.info('HTTP Request', {
      context: context || 'HTTP',
      method,
      url,
      statusCode,
    });
  }

  /**
   * Log authentication events
   */
  logAuth(event: string, email?: string, success?: boolean) {
    this.logger.info('Authentication event', {
      context: 'Auth',
      event,
      email,
      success,
    });
  }
}
