import type { User } from '../../../user/domain/entities/user.entity.js';

export interface AuthenticationOutput {
  accessToken: string;
  accessTokenExpiresInSeconds: number;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  user: User;
}
