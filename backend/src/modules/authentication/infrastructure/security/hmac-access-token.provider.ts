import { createHmac, timingSafeEqual } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { authConfig } from '../../../../common/config/index.js';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import type { AccessTokenProviderInterface } from '../../application/interfaces/access-token-provider.interface.js';

interface TokenPayload {
  exp: number;
  iat: number;
  sub: string;
}

@Injectable()
export class HmacAccessTokenProvider implements AccessTokenProviderInterface {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  create(userId: string, expiresInSeconds: number): string {
    const now = Math.floor(Date.now() / 1000);
    const header = this.encode({ alg: 'HS256', typ: 'JWT' });
    const payload = this.encode({
      sub: userId,
      iat: now,
      exp: now + expiresInSeconds,
    });
    const content = `${header}.${payload}`;
    return `${content}.${this.sign(content)}`;
  }

  verify(token: string): { userId: string } {
    const [header, payload, signature, extra] = token.split('.');
    if (!header || !payload || !signature || extra) this.unauthorized();
    this.verifyHeader(header!);
    this.verifySignature(`${header}.${payload}`, signature!);
    const parsed = this.parsePayload(payload!);
    return { userId: parsed.sub };
  }

  private verifyHeader(encoded: string): void {
    try {
      const header = JSON.parse(
        Buffer.from(encoded, 'base64url').toString('utf8'),
      ) as { alg?: string; typ?: string };
      if (header.alg !== 'HS256' || header.typ !== 'JWT') this.unauthorized();
    } catch {
      this.unauthorized();
    }
  }

  private verifySignature(content: string, signature: string): void {
    const expected = Buffer.from(this.sign(content));
    const actual = Buffer.from(signature);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      this.unauthorized();
  }

  private parsePayload(encoded: string): TokenPayload {
    try {
      const value = JSON.parse(
        Buffer.from(encoded, 'base64url').toString('utf8'),
      ) as TokenPayload;
      if (
        !value.sub ||
        !Number.isInteger(value.exp) ||
        value.exp <= Date.now() / 1000
      )
        this.unauthorized();
      return value;
    } catch {
      this.unauthorized();
    }
  }

  private encode(value: object): string {
    return Buffer.from(JSON.stringify(value)).toString('base64url');
  }
  private sign(value: string): string {
    return createHmac('sha256', this.config.jwtAccessSecret)
      .update(value)
      .digest('base64url');
  }
  private unauthorized(): never {
    throw new BusinessException({
      code: ErrorCode.UNAUTHORIZED,
      message: 'Access token is invalid or expired',
    });
  }
}
