import { HttpStatus } from '@nestjs/common';

export class DomainError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status:
      | HttpStatus.OK
      | HttpStatus.BAD_REQUEST
      | HttpStatus.NOT_FOUND
      | HttpStatus.CONFLICT
      | HttpStatus.INTERNAL_SERVER_ERROR
      | HttpStatus.UNAUTHORIZED
      | HttpStatus.FORBIDDEN,
    public context?: string,
    public details?: any,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
