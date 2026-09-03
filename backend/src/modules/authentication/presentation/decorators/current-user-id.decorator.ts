import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { RequestWithContext } from '../../../../common/middleware/request-context.middleware.js';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const userId = request.requestContext.userId;
    if (!userId) throw new UnauthorizedException('Authentication is required');
    return userId;
  },
);
