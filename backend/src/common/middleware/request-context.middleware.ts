import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import {
  CORRELATION_ID_HEADER,
  REQUEST_ID_HEADER,
} from '../constants/headers.constants.js';
import type { RequestContext } from '../types/request-context.type.js';
import { resolveRequestId } from '../utils/request-id.util.js';
import { RequestContextStorage } from './request-context.storage.js';

export type RequestWithContext = Request & {
  requestContext: RequestContext;
};

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly contextStorage: RequestContextStorage) {}

  use(
    request: RequestWithContext,
    response: Response,
    next: NextFunction,
  ): void {
    const requestId = resolveRequestId(request.get(REQUEST_ID_HEADER));
    const correlationId = resolveRequestId(
      request.get(CORRELATION_ID_HEADER) ?? requestId,
    );
    const context = { requestId, correlationId };

    request.requestContext = context;
    response.setHeader(REQUEST_ID_HEADER, requestId);
    response.setHeader(CORRELATION_ID_HEADER, correlationId);
    this.contextStorage.run(context, next);
  }
}
