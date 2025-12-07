import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  UserNotFoundException,
  UserAlreadyExistsException,
  InvalidCredentialsException,
  UserErrors,
} from 'src/common/exceptions';

@Catch(UserErrors)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    if (exception instanceof UserNotFoundException) {
      if (exception.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(exception.message);
      }

      if (exception.status === HttpStatus.UNAUTHORIZED) {
        throw new UnauthorizedException(exception.message);
      }
    } else if (exception instanceof UserAlreadyExistsException) {
      // Convert domain-level "user already exists" into a 409 Conflict
      throw new ConflictException(exception.message);
    } else if (exception instanceof InvalidCredentialsException) {
      // Convert invalid credentials into 401 Unauthorized
      throw new UnauthorizedException(exception.message);
    }
  }
}
