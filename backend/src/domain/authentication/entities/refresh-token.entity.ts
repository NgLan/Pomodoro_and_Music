import {
  BusinessException,
  ErrorCode,
} from '../../../common/exceptions/index.js';

export interface RefreshTokenProps {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export class RefreshToken {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  private readonly expiresAtValue: Date;
  private revokedAtValue: Date | null;
  private readonly createdAtValue: Date;

  private constructor(props: RefreshTokenProps) {
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

    if (
      props.revokedAt &&
      (!Number.isFinite(props.revokedAt.getTime()) ||
        props.revokedAt.getTime() < createdAt)
    ) {
      throw new BusinessException({
        code: ErrorCode.INVALID_REFRESH_TOKEN_REVOCATION,
        message: 'Refresh token revocation cannot precede its creation time',
      });
    }

    this.id = props.id;
    this.userId = props.userId;
    this.tokenHash = props.tokenHash;
    this.expiresAtValue = new Date(props.expiresAt);
    this.revokedAtValue = props.revokedAt ? new Date(props.revokedAt) : null;
    this.createdAtValue = new Date(props.createdAt);
  }

  static create(props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(props);
  }

  get expiresAt(): Date {
    return new Date(this.expiresAtValue);
  }

  get revokedAt(): Date | null {
    return this.revokedAtValue ? new Date(this.revokedAtValue) : null;
  }

  get createdAt(): Date {
    return new Date(this.createdAtValue);
  }

  isExpired(now: Date): boolean {
    return now.getTime() >= this.expiresAtValue.getTime();
  }

  isRevoked(): boolean {
    return this.revokedAtValue !== null;
  }

  isActive(now: Date): boolean {
    return !this.isRevoked() && !this.isExpired(now);
  }

  revoke(at: Date): void {
    if (this.isRevoked()) {
      return;
    }
    if (
      !Number.isFinite(at.getTime()) ||
      at.getTime() < this.createdAtValue.getTime()
    ) {
      throw new BusinessException({
        code: ErrorCode.INVALID_REFRESH_TOKEN_REVOCATION,
        message: 'Refresh token revocation cannot precede its creation time',
      });
    }
    this.revokedAtValue = new Date(at);
  }
}
