import {
  type ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request } from 'express';
import {
  AppException,
  ErrorCode,
  InfrastructureException,
  type ErrorDetail,
} from '../exceptions/index.js';
import { PUBLIC_INFRASTRUCTURE_ERROR_MESSAGE } from '../constants/app.constants.js';
import { AppLoggerService } from '../logging/app-logger.service.js';
import { ERROR_STATUS } from './error-status.map.js';
import type { RequestWithContext } from '../middleware/request-context.middleware.js';
import { RequestContextStorage } from '../middleware/request-context.storage.js';

interface ErrorResponse {
  code: number;
  message: string;
  error_code: ErrorCode;
  details: ErrorDetail[];
  request_id: string | undefined;
}

function codeForHttpStatus(status: number): ErrorCode {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return ErrorCode.INVALID_INPUT;
    case HttpStatus.UNAUTHORIZED:
      return ErrorCode.UNAUTHORIZED;
    case HttpStatus.FORBIDDEN:
      return ErrorCode.FORBIDDEN;
    case HttpStatus.NOT_FOUND:
      return ErrorCode.RESOURCE_NOT_FOUND;
    case HttpStatus.CONFLICT:
      return ErrorCode.CONFLICT;
    default:
      return status >= 500 ? ErrorCode.INTERNAL_ERROR : ErrorCode.INVALID_INPUT;
  }
}

function getHttpExceptionMessage(exception: HttpException): string {
  if (exception.getStatus() >= 500) {
    return 'Internal server error';
  }
  const response = exception.getResponse();
  if (typeof response === 'string') {
    return response;
  }
  if (!('message' in response)) {
    return exception.message;
  }
  const message = response.message;
  return typeof message === 'string' ? message : exception.message;
}

function getHttpExceptionDetails(exception: HttpException): ErrorDetail[] {
  const response = exception.getResponse();
  if (
    typeof response !== 'object' ||
    response === null ||
    !('message' in response) ||
    !Array.isArray(response.message)
  ) {
    return [];
  }
  return response.message.map((message) => ({ message: String(message) }));
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly logger: AppLoggerService,
    private readonly contextStorage: RequestContextStorage,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request & Partial<RequestWithContext>>();
    const response = context.getResponse();
    const errorResponse = this.mapException(exception, request);

    const logEntry = {
      event: 'http_exception',
      operation: `${request.method} ${request.path}`,
      error_code: errorResponse.error_code,
      status_code: errorResponse.code,
      error: exception,
    };
    if (errorResponse.code >= 500) {
      this.logger.error(logEntry);
    } else {
      this.logger.warn(logEntry);
    }

    this.adapterHost.httpAdapter.reply(
      response,
      errorResponse,
      errorResponse.code,
    );
  }

  private mapException(
    exception: unknown,
    request: Partial<RequestWithContext>,
  ): ErrorResponse {
    const requestId =
      request.requestContext?.requestId ?? this.contextStorage.get()?.requestId;

    if (exception instanceof AppException) {
      return {
        code: ERROR_STATUS[exception.code],
        message:
          exception instanceof InfrastructureException
            ? PUBLIC_INFRASTRUCTURE_ERROR_MESSAGE
            : exception.message,
        error_code: exception.code,
        details:
          exception instanceof InfrastructureException ? [] : exception.details,
        request_id: requestId,
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return {
        code: status,
        message: getHttpExceptionMessage(exception),
        error_code: codeForHttpStatus(status),
        details: getHttpExceptionDetails(exception),
        request_id: requestId,
      };
    }

    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error_code: ErrorCode.INTERNAL_ERROR,
      details: [],
      request_id: requestId,
    };
  }
}
