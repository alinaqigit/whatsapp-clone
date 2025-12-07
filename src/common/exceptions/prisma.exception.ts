import { HttpStatus } from '@nestjs/common';
import { DomainError } from './domain-error.exception';

export class PrismaException extends DomainError {
  constructor(
    message: string,
    code: DomainError['code'],
    status: DomainError['status'],
    context?: string,
    details?: any,
  ) {
    super(message, code, status, context, details);
    this.name = 'PrismaException';
  }
}

export class PrismaConflictException extends PrismaException {
  constructor(message: string, context?: string, details?: any) {
    super(
      'Unique constraint failed: ' + message,
      'P2002',
      HttpStatus.CONFLICT,
      context,
      details,
    );
    this.name = 'PrismaConflictException';
  }
}

export class InvalidQueryException extends PrismaException {
  constructor(message: string, context?: string, details?: any) {
    super(
      'Invalid query: ' + message,
      'INVALID_QUERY',
      HttpStatus.BAD_REQUEST,
      context,
      details,
    );
    this.name = 'InvalidQueryException';
  }
}

export class DependantRecoredDoesNotExist extends PrismaException {
  constructor(message: string, context?: string, details?: any) {
    super(
      'Could Not find dependant Record: ' + message,
      'dependant entity not found',
      HttpStatus.NOT_FOUND,
      context,
      details,
    );
    this.name = 'Bad Request';
  }
}

export class UnknownError extends PrismaException {
  constructor(message: string, context?: string, details?: any) {
    super(
      'Unknown error: ' + message,
      'UNKNOWN_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
      context,
      details,
    );
    this.name = 'UnknownError';
  }
}

export class CustomValidationError extends PrismaException {
  constructor(message: string, context?: string, details?: any) {
    super(
      'Validation error: ' + message,
      'VALIDATION_ERROR',
      HttpStatus.BAD_REQUEST,
      context,
      details,
    );
    this.name = 'CustomValidationError';
  }
}
