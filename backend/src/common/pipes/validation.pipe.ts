import { Injectable, ValidationPipe } from '@nestjs/common';
import { AppException } from '../exceptions/app.exception.js';
import { ErrorCode } from '../exceptions/error-code.enum.js';
import { mapValidationErrors } from '../validation/validation-error.mapper.js';

@Injectable()
export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      transformOptions: { enableImplicitConversion: false },
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) =>
        new AppException({
          code: ErrorCode.INVALID_INPUT,
          message: 'Invalid request',
          details: mapValidationErrors(errors),
        }),
    });
  }
}
