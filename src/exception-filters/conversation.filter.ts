import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, NotFoundException } from '@nestjs/common';
import {
  ConversationError,
  ConversationToBeDeletedNotFound,
  MemberForConverstionNotFound,
} from 'src/common/exceptions';

@Catch(ConversationError)
export class ConversationExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    
    if (exception instanceof MemberForConverstionNotFound) {
      throw new NotFoundException(exception.message);
    } else if (exception instanceof ConversationToBeDeletedNotFound) {
      throw new NotFoundException(exception.message)
    }
  }
}
