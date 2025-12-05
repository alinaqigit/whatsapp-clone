import { DomainError } from './domain-error.exception';

export class ConversationError extends DomainError {
  constructor(
    message: string,
    code: string,
    status: number,
    details?: any,
  ) {
    super(message, code, status, details);
    this.name = 'ConversationError';
  }
}

export class ConversationAlreadyExistsException extends ConversationError {
  constructor(
    code: string,
    status: number,
    message?: string,
    details?: any,
  ) {
    super(message ?? "Conversation already exists", code, status, details);
    this.name = 'ConversationAlreadyExistsException';
  }
}
