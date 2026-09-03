import type { Response } from 'express';
import type { AuthenticationOutput } from '../../application/outputs/authentication.output.js';

export const REFRESH_TOKEN_COOKIE = 'cappucino_refresh_token';

export function setRefreshTokenCookie(
  response: Response,
  output: AuthenticationOutput,
  isProduction: boolean,
): void {
  response.cookie(REFRESH_TOKEN_COOKIE, output.refreshToken, {
    expires: output.refreshTokenExpiresAt,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: isProduction,
  });
}

export function clearRefreshTokenCookie(response: Response): void {
  response.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
}
