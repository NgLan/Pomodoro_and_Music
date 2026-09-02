import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { tap, type Observable } from 'rxjs';
import { AppLoggerService } from '../logging/app-logger.service.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = performance.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const operation = `${request.method} ${request.path}`;

    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.log({
            event: 'http_request_completed',
            operation,
            duration_ms: Math.round(performance.now() - startedAt),
            status_code: response.statusCode,
          }),
        error: (error: unknown) =>
          this.logger.warn({
            event: 'http_request_failed',
            operation,
            duration_ms: Math.round(performance.now() - startedAt),
            error,
          }),
      }),
    );
  }
}
