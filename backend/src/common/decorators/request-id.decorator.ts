import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { RequestWithContext } from '../middleware/request-context.middleware.js';

export const RequestId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | undefined =>
    context.switchToHttp().getRequest<RequestWithContext>().requestContext
      ?.requestId,
);
