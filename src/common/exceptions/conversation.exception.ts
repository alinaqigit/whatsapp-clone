import { DomainError } from './domain-error.exception';

export class ConversationError extends DomainError {
  constructor(message: string, code: string, status: number, details?: any) {
    super(message, code, status, details);
    this.name = 'ConversationError';
  }
}

export class MemberForConverstionNotFound extends ConversationError {
  constructor(code: string, status: number, message?: string, details?: any) {
    super(message ?? 'Member Not Found', code, status, details);
    this.name = 'MemberNotFound';
  }
}

export class ConversationToBeDeletedNotFound extends ConversationError {
  constructor(code: string, status: number, message?: string, details?: any) {
    super(message ?? 'Conversation Not Found', code, status, details);
    this.name = 'ConversationNotFoundException';
  }
}

export class ConversationNotFound extends ConversationError {
  constructor(code: string, status: number, message?: string, details?: any) {
    super(message ?? 'Conversation Not Found', code, status, details);
    this.name = 'ConversationNotFoundException';
  }
}

export class ConversationUnauthorizedAccess extends ConversationError {
  constructor(code: string, status: number, message?: string, details?: any) {
    super(
      message ?? 'This operation is only allowed for the conversation owner',
      code,
      status,
      details,
    );
    this.name = 'ConversationUnauthorizedAccess';
  }
}