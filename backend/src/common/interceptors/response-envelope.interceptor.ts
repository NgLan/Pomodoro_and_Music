import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { map, type Observable } from 'rxjs';
import { DEFAULT_SUCCESS_MESSAGE } from '../constants/app.constants.js';
import { ApiResponseDto } from '../dto/api-response.dto.js';

function isSuccessEnvelope(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    value.status === 'success' &&
    'code' in value &&
    'data' in value
  );
}

@Injectable()
export class ResponseEnvelopeInterceptor<T> implements NestInterceptor<
  T,
  T | ApiResponseDto<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | ApiResponseDto<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next
      .handle()
      .pipe(
        map((data) =>
          isSuccessEnvelope(data)
            ? data
            : new ApiResponseDto(
                response.statusCode,
                DEFAULT_SUCCESS_MESSAGE,
                data,
              ),
        ),
      );
  }
}
