export const ACCESS_TOKEN_PROVIDER = Symbol('ACCESS_TOKEN_PROVIDER');

export interface AccessTokenProviderInterface {
  create(userId: string, expiresInSeconds: number): string;
  verify(token: string): { userId: string };
}
