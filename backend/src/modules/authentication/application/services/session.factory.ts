import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { authConfig } from '../../../../common/config/index.js';
import { generateRandomToken } from '../../../../common/security/random-token.js';
import { hashToken } from '../../../../common/security/token-hash.js';
import type { User } from '../../../user/domain/entities/user.entity.js';
import { RefreshToken } from '../../domain/entities/refresh-token.entity.js';
import {
  ACCESS_TOKEN_PROVIDER,
  type AccessTokenProviderInterface,
} from '../interfaces/access-token-provider.interface.js';
import type { AuthenticationOutput } from '../outputs/authentication.output.js';

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;

function parseDurationSeconds(value: string): number {
  const match = /^(\d+)(ms|s|m|h|d|w)$/.exec(value);
  if (!match) throw new Error(`Invalid duration: ${value}`);
  const units = { ms: 0.001, s: 1, m: 60, h: 3600, d: 86400, w: 604800 };
  return Math.floor(Number(match[1]) * units[match[2] as keyof typeof units]);
}

@Injectable()
export class SessionFactory {
  private readonly refreshTtl: number;

  constructor(
    @Inject(ACCESS_TOKEN_PROVIDER)
    private readonly accessTokens: AccessTokenProviderInterface,
    @Inject(authConfig.KEY) configuration: ConfigType<typeof authConfig>,
  ) {
    const accessTtl = parseDurationSeconds(configuration.jwtAccessTtl);
    const refreshTtl = parseDurationSeconds(configuration.refreshTokenTtl);
    if (accessTtl !== ACCESS_TOKEN_TTL_SECONDS)
      throw new Error('JWT_ACCESS_TTL must be 15m');
    if (refreshTtl !== REFRESH_TOKEN_TTL_SECONDS)
      throw new Error('REFRESH_TOKEN_TTL must be 30d');
    this.refreshTtl = refreshTtl;
  }

  createRefreshToken(userId: string, now: Date) {
    const rawToken = generateRandomToken();
    const expiresAt = new Date(now.getTime() + this.refreshTtl * 1000);
    const entity = RefreshToken.create({
      id: randomUUID(),
      userId,
      tokenHash: hashToken(rawToken),
      expiresAt,
      revokedAt: null,
      createdAt: now,
    });
    return { entity, rawToken };
  }

  createOutput(
    user: User,
    rawToken: string,
    expiresAt: Date,
  ): AuthenticationOutput {
    return {
      accessToken: this.accessTokens.create(user.id, ACCESS_TOKEN_TTL_SECONDS),
      accessTokenExpiresInSeconds: ACCESS_TOKEN_TTL_SECONDS,
      refreshToken: rawToken,
      refreshTokenExpiresAt: expiresAt,
      user,
    };
  }
}
