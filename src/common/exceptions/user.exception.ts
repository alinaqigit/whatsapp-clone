import { DomainError } from './domain-error.exception';

export class UserErrors extends DomainError {
  constructor(
    message: string,
    code: DomainError['code'],
    status: DomainError['status'],
    details?: any,
  ) {
    super(message, code, status, details);
    this.name = 'UserErrors';
  }
}

export class UserNotFoundException extends UserErrors {
  constructor(
    message: string,
    code: DomainError['code'],
    status: DomainError['status'],
    details?: any,
  ) {
    super('User not found: ' + message, code, status, details);
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends UserErrors {
  constructor(
    message: string,
    code: DomainError['code'],
    status: DomainError['status'],
    details?: any,
  ) {
    super('User already exists: ' + message, code, status, details);
    this.name = 'UserAlreadyExistsException';
  }
}

export class InvalidCredentialsException extends UserErrors {
  constructor(
    message: string,
    code: DomainError['code'],
    status: DomainError['status'],
    details?: any,
  ) {
    super('Invalid credentials provided: ' + message, code, status, details);
    this.name = 'InvalidCredentialsException';
  }
}
