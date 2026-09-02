import { AppException, type AppExceptionOptions } from './app.exception.js';
import type { InfrastructureErrorCode } from './error-code.enum.js';

export interface InfrastructureExceptionOptions extends Omit<
  AppExceptionOptions,
  'code'
> {
  code: InfrastructureErrorCode;
}

export class InfrastructureException extends AppException {
  constructor(options: InfrastructureExceptionOptions) {
    super(options);
  }
}
