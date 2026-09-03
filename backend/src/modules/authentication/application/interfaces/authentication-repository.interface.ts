import type { RefreshToken } from '../../domain/entities/refresh-token.entity.js';
import type { User } from '../../../user/domain/entities/user.entity.js';

export const AUTHENTICATION_REPOSITORY = Symbol('AUTHENTICATION_REPOSITORY');

export interface AuthenticationRepositoryInterface {
  findUserByEmail(email: string): Promise<User | null>;
  findActiveUserById(id: string): Promise<User | null>;
  findRefreshToken(tokenHash: string): Promise<RefreshToken | null>;
  createUserWithRefreshToken(user: User, token: RefreshToken): Promise<void>;
  saveRefreshToken(token: RefreshToken): Promise<void>;
  replaceRefreshToken(currentId: string, token: RefreshToken, at: Date): Promise<void>;
  revokeRefreshToken(tokenHash: string, at: Date): Promise<void>;
}
