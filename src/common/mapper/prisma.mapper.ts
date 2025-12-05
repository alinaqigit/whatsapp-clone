import { InternalServerErrorException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { CustomValidationError, InvalidQueryException, PrismaConflictException, UnknownError } from 'src/common/exceptions';

/**
 * Map a Prisma error to an appropriate NestJS HttpException and throw it.
 *
 * Usage:
 * try {
 *   // prisma call
 * } catch (err) {
 *   mapPrismaErrorToHttpException(err);
 * }
 *
 * This function always throws an HttpException.
 */
export function mapPrismaError(error: any): never {
  // Type guard helpers
  const isKnownRequestError = (
    err: unknown,
  ): err is Prisma.PrismaClientKnownRequestError =>
    typeof err === 'object' && err !== null && 'code' in (err as any);

  const isValidationError = (
    err: unknown,
  ): err is Prisma.PrismaClientValidationError =>
    !!err &&
    typeof (err as any).message === 'string' &&
    (err as any).name === 'ValidationError';

  const isUnknownRequestError = (
    err: unknown,
  ): err is Prisma.PrismaClientUnknownRequestError =>
    err instanceof Prisma.PrismaClientUnknownRequestError;

  const isRustPanicError = (
    err: unknown,
  ): err is Prisma.PrismaClientRustPanicError =>
    err instanceof Prisma.PrismaClientRustPanicError;

  const isInitializationError = (
    err: unknown,
  ): err is Prisma.PrismaClientInitializationError =>
    err instanceof Prisma.PrismaClientInitializationError;

    /**
     * Extract the target field(s) from the error metadata and normalize to a string.
     *
     * Prisma's error metadata shape can vary across versions:
     * - meta.target: string | string[] (modern Prisma; often an array for compound keys)
     * - meta.field_name: string (older Prisma versions)
     * - meta may be null/undefined or contain other properties (cause, details, etc.)
     *
     * This helper returns a comma-separated list when multiple fields are present,
     * or an empty string when no target information is available.
     *
     * Examples:
     *   { target: ['email'] }            -> "email"
     *   { target: ['first','last'] }     -> "first, last"
     *   { field_name: 'id' }             -> "id"
     */
  const formatTarget = (meta: any): string => {
    if (!meta) return '';
    const target = meta.target ?? meta.field_name;
    if (!target) return '';
    if (Array.isArray(target)) return target.join(', ');
    return String(target);
  };

  if (isKnownRequestError(error)) {
    // Prisma known errors have .code (P####)
    switch (error.code) {
      // Unique constraint failed
      case 'P2002': {
        const meta = (error as any).meta ?? {};
        const moduleName = meta.module ?? meta.model ?? meta.resource ?? meta.table ?? '';
        const target = formatTarget(meta);
        const baseMessage = target
          ? `Unique constraint failed on the field(s): ${target}`
          : 'Unique constraint failed';
        const message = moduleName ? `${baseMessage} (module: ${moduleName})` : baseMessage;
        throw new PrismaConflictException(message);
      }

      // Record to delete does not exist.
      // case 'P2025': {
      //   // error.meta may include cause or details
      //   const meta = (error as any).meta ?? {};
      //   const cause = meta.cause ?? error.message;
      //   throw new NotFoundException(cause ?? 'Record not found');
      // }

      // Foreign key constraint failed on the field
      // case 'P2003':
      // case 'P2004':
      //   throw new BadRequestException(error.message);

      // Invalid query or params (type mismatch, JSON parsing etc.)
      case 'P2009':
      case 'P2005':
      case 'P2012':
        throw new InvalidQueryException(error.message);

      default:
        // unknown Prisma known request error -> 500
        throw new UnknownError(error.message);
    }
  }

  if (isValidationError(error)) {
    throw new CustomValidationError(error.message);
  }

  if (
    isUnknownRequestError(error) ||
    isRustPanicError(error) ||
    isInitializationError(error)
  ) {
    // These indicate issues outside of request validation (runtime, initialization, rust panics)
    throw new InternalServerErrorException(error.message ?? 'Database error');
  }

  // Fallback for non-Prisma or unexpected errors
  if (error instanceof Error) {
    throw new InternalServerErrorException(error.message);
  }

  throw new InternalServerErrorException('An unexpected error occurred');
}
