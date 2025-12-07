import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import {
  ConversationError,
  ConversationNotFound,
  ConversationToBeDeletedNotFound,
  MemberForConverstionNotFound,
} from 'src/common/exceptions';

@Catch(ConversationError)
export class ConversationExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    if (
      exception instanceof MemberForConverstionNotFound ||
      exception instanceof ConversationToBeDeletedNotFound || 
      exception instanceof ConversationNotFound
    ) {
      throw new NotFoundException(exception.message);
    }
  }
}
