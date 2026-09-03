import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { RequestWithContext } from '../../../../common/middleware/request-context.middleware.js';
import { RequestContextStorage } from '../../../../common/middleware/request-context.storage.js';
import { AuthenticationService } from '../../application/services/authentication.service.js';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly authentication: AuthenticationService,
    private readonly contextStorage: RequestContextStorage,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication is required');
    }
    const user = await this.authentication.authenticate(authorization.slice(7));
    request.requestContext.userId = user.id;
    const stored = this.contextStorage.get();
    if (stored) stored.userId = user.id;
    return true;
  }
}
