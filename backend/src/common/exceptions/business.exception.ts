import { AppException, type AppExceptionOptions } from './app.exception.js';
import { ErrorCode, type InfrastructureErrorCode } from './error-code.enum.js';

type BusinessErrorCode = Exclude<
  ErrorCode,
  InfrastructureErrorCode | ErrorCode.INTERNAL_ERROR
>;

export interface BusinessExceptionOptions extends Omit<
  AppExceptionOptions,
  'code'
> {
  code: BusinessErrorCode;
}

export class BusinessException extends AppException {
  constructor(options: BusinessExceptionOptions) {
    super(options);
  }
}
