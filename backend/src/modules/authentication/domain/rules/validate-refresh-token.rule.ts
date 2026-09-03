import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import type { RefreshTokenProps } from '../entities/refresh-token.entity.js';

export function validateRefreshToken(props: RefreshTokenProps): void {
  const createdAt = props.createdAt.getTime();
  const expiresAt = props.expiresAt.getTime();
  if (
    !Number.isFinite(createdAt) ||
    !Number.isFinite(expiresAt) ||
    expiresAt <= createdAt
  ) {
    throw new BusinessException({
      code: ErrorCode.INVALID_REFRESH_TOKEN_EXPIRY,
      message: 'Refresh token expiry must be after its creation time',
    });
  }
  const revokedAt = props.revokedAt?.getTime();
  if (
    revokedAt !== undefined &&
    (!Number.isFinite(revokedAt) || revokedAt < createdAt)
  ) {
    throw new BusinessException({
      code: ErrorCode.INVALID_REFRESH_TOKEN_REVOCATION,
      message: 'Refresh token revocation cannot precede its creation time',
    });
  }
}
