import { HttpStatus } from '@nestjs/common';
import {
  DependantRecoredDoesNotExist,
  DomainError,
  InvalidCredentialsException,
  InvalidQueryException,
  PrismaConflictException,
  PrismaException,
  UserAlreadyExistsException,
  MemberForConverstionNotFound,
  ConversationToBeDeletedNotFound,
} from 'src/common/exceptions';

export function mapConversationError(error: any): never {
  // check if the error is custom error
  if (error instanceof DomainError) {
    const message = error.message;
    const details = error.details;
    const code = error.code;

    // check if it is a known user error
    if (error instanceof PrismaException) {
      if (error instanceof PrismaConflictException) {
        throw new UserAlreadyExistsException(
          message,
          code,
          HttpStatus.CONFLICT,
          details,
        );
      }

      if (error instanceof InvalidQueryException) {
        throw new InvalidCredentialsException(
          message,
          code,
          HttpStatus.BAD_REQUEST,
          details,
        );
      }

      if (error instanceof DependantRecoredDoesNotExist) {
        if (error.context && error.context === 'creating-conversation')
          throw new MemberForConverstionNotFound(
            error.code,
            HttpStatus.NOT_FOUND,
            'Specified member(s) for this conversation not found',
          );

        throw new ConversationToBeDeletedNotFound(
          error.code,
          HttpStatus.NOT_FOUND,
          'Conversation to be deleted not found',
        );
      }
    }
  }

  throw error;
}
