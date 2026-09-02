import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { RequestContext } from '../types/request-context.type.js';

interface RequestWithContext {
  requestContext?: RequestContext;
}

export const RequestId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | undefined =>
    context.switchToHttp().getRequest<RequestWithContext>().requestContext
      ?.requestId,
);
