import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { AppLoggerService } from '@infrastructure/logger';

/**
 * Centralized database error handler
 * Converts database-specific errors into HTTP exceptions and logs them using Winston
 */
@Injectable()
export class DatabaseErrorHandler {
  private static logger: AppLoggerService;

  constructor(logger: AppLoggerService) {
    DatabaseErrorHandler.logger = logger;
  }

  /**
   * Handle database errors and throw appropriate HTTP exceptions
   * @param error - The database error
   * @param context - Optional context for logging (e.g., 'CreateUserUseCase')
   */
  static handle(error: any, context?: string): never {
    const errorContext = context || 'DatabaseError';

    // PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html

    // 23505: Unique constraint violation
    if (error.code === '23505') {
      const detail = error.detail || 'Duplicate entry found';
      this.logger?.error(
        `Unique constraint violation: ${detail}`,
        error.stack,
        errorContext,
      );
      throw new ConflictException(detail);
    }

    // 23503: Foreign key violation
    if (error.code === '23503') {
      const detail =
        error.detail || 'Cannot perform operation: referenced record not found';
      this.logger?.error(
        `Foreign key violation: ${detail}`,
        error.stack,
        errorContext,
      );
      throw new BadRequestException(detail);
    }

    // 23502: Not null violation
    if (error.code === '23502') {
      const column = error.column || 'unknown field';
      const message = `Required field '${column}' cannot be null`;
      this.logger?.error(
        `Not null violation: ${message}`,
        error.stack,
        errorContext,
      );
      throw new BadRequestException(message);
    }

    // 23514: Check constraint violation
    if (error.code === '23514') {
      const detail = error.detail || 'Data validation failed';
      this.logger?.error(
        `Check constraint violation: ${detail}`,
        error.stack,
        errorContext,
      );
      throw new BadRequestException(detail);
    }

    // 42P01: Undefined table
    if (error.code === '42P01') {
      this.logger?.error(
        `Table does not exist: ${error.message}`,
        error.stack,
        errorContext,
      );
      throw new InternalServerErrorException(
        'Database schema error. Please contact support.',
      );
    }

    // Generic database error
    this.logger?.logDatabaseError(error, errorContext);

    throw new InternalServerErrorException(
      'An unexpected database error occurred. Please try again later.',
    );
  }

  /**
   * Check if error is a "not found" scenario
   * Use this when a query returns null/undefined
   */
  static handleNotFound(
    entityName: string,
    identifier: string | number,
  ): never {
    const message = `${entityName} with identifier '${identifier}' not found`;
    this.logger?.warn(message, 'NotFound');
    throw new NotFoundException(message);
  }
}
