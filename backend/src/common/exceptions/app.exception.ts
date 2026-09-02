import type { ErrorDetail } from './error-detail.js';
import { ErrorCode } from './error-code.enum.js';

export interface AppExceptionOptions {
  code: ErrorCode;
  message: string;
  details?: ErrorDetail[];
  cause?: unknown;
}

export class AppException extends Error {
  readonly code: ErrorCode;
  readonly details: ErrorDetail[];

  constructor(options: AppExceptionOptions) {
    super(options.message, { cause: options.cause });
    this.name = this.constructor.name;
    this.code = options.code;
    this.details = options.details ?? [];
  }
}
