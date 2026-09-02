import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code.enum.js';

export const ERROR_STATUS = {
  [ErrorCode.INVALID_INPUT]: HttpStatus.BAD_REQUEST,
  [ErrorCode.BUSINESS_RULE_VIOLATION]: HttpStatus.UNPROCESSABLE_ENTITY,
  [ErrorCode.RESOURCE_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCode.CONFLICT]: HttpStatus.CONFLICT,
  [ErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.FORBIDDEN]: HttpStatus.FORBIDDEN,
  [ErrorCode.INFRASTRUCTURE_ERROR]: HttpStatus.SERVICE_UNAVAILABLE,
  [ErrorCode.INTERNAL_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
} as const satisfies Record<ErrorCode, HttpStatus>;
