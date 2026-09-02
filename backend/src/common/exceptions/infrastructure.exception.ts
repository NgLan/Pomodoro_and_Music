import { AppException } from './app.exception.js';
import { ErrorCode } from './error-code.enum.js';

export class InfrastructureException extends AppException {
  constructor(cause?: unknown, message = 'Service temporarily unavailable') {
    super({
      code: ErrorCode.INFRASTRUCTURE_ERROR,
      message,
      cause,
    });
  }
}
