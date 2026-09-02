import { registerAs } from '@nestjs/config';
import type { AuthConfig } from './config.types.js';

export default registerAs('auth', (): AuthConfig => ({
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  jwtAccessTtl: process.env.JWT_ACCESS_TTL!,
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL!,
}));
