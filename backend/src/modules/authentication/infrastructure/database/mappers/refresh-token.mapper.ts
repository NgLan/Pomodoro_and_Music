import { RefreshToken } from '../../../domain/entities/refresh-token.entity.js';
import { RefreshTokenOrmEntity } from '../entities/refresh-token.orm-entity.js';

export function toRefreshTokenDomain(entity: RefreshTokenOrmEntity): RefreshToken {
  return RefreshToken.create({ ...entity });
}

export function toRefreshTokenPersistence(token: RefreshToken): RefreshTokenOrmEntity {
  return Object.assign(new RefreshTokenOrmEntity(), {
    id: token.id,
    userId: token.userId,
    tokenHash: token.tokenHash,
    expiresAt: token.expiresAt,
    revokedAt: token.revokedAt,
    createdAt: token.createdAt,
  });
}
