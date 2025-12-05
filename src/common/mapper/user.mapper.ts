import { HttpStatus } from '@nestjs/common';
import {
  DomainError,
  InvalidCredentialsException,
  InvalidQueryException,
  PrismaConflictException,
  PrismaException,
  UserAlreadyExistsException,
} from 'src/common/exceptions';

export function mapUserError(error: any): never {
  // check if the error is custom error
  if (error instanceof DomainError) {
    
    const message = error.message;
    const details = error.details;
    const code = error.code;

    // check if it is a known user error
    if (error instanceof PrismaException) {
      if (error instanceof PrismaConflictException) {
        throw new UserAlreadyExistsException(message, code, HttpStatus.CONFLICT, details);
      }

      if (error instanceof InvalidQueryException) {
        throw new InvalidCredentialsException(message, code, HttpStatus.BAD_REQUEST, details);
      }
    }
  }

  throw error;
}
