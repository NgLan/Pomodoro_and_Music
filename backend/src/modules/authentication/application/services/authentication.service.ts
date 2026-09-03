import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import { hashToken } from '../../../../common/security/token-hash.js';
import { User } from '../../../user/domain/entities/user.entity.js';
import { AuthProvider } from '../../../user/domain/enums/auth-provider.enum.js';
import { UserStatus } from '../../../user/domain/enums/user-status.enum.js';
import type { LoginInput } from '../inputs/login.input.js';
import type { RegisterInput } from '../inputs/register.input.js';
import {
  ACCESS_TOKEN_PROVIDER,
  type AccessTokenProviderInterface,
} from '../interfaces/access-token-provider.interface.js';
import {
  AUTHENTICATION_REPOSITORY,
  type AuthenticationRepositoryInterface,
} from '../interfaces/authentication-repository.interface.js';
import type { AuthenticationServiceInterface } from '../interfaces/authentication-service.interface.js';
import {
  PASSWORD_HASHER,
  type PasswordHasherInterface,
} from '../interfaces/password-hasher.interface.js';
import type { AuthenticationOutput } from '../outputs/authentication.output.js';
import { SessionFactory } from './session.factory.js';

@Injectable()
export class AuthenticationService implements AuthenticationServiceInterface {
  constructor(
    @Inject(AUTHENTICATION_REPOSITORY)
    private readonly repository: AuthenticationRepositoryInterface,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherInterface,
    @Inject(ACCESS_TOKEN_PROVIDER)
    private readonly accessTokens: AccessTokenProviderInterface,
    private readonly sessions: SessionFactory,
  ) {}

  async register(input: RegisterInput): Promise<AuthenticationOutput> {
    const email = input.email.trim().toLowerCase();
    if (await this.repository.findUserByEmail(email)) this.emailExists();
    const now = new Date();
    const user = User.create({
      id: randomUUID(),
      email,
      displayName: input.displayName?.trim() || null,
      passwordHash: await this.passwordHasher.hash(input.password),
      authProvider: AuthProvider.LOCAL,
      providerSubject: null,
      status: UserStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });
    const refresh = this.sessions.createRefreshToken(user.id, now);
    await this.repository.createUserWithRefreshToken(user, refresh.entity);
    return this.sessions.createOutput(
      user,
      refresh.rawToken,
      refresh.entity.expiresAt,
    );
  }

  async login(input: LoginInput): Promise<AuthenticationOutput> {
    const email = input.email.trim().toLowerCase();
    const user = await this.repository.findUserByEmail(email);
    if (!(await this.hasValidCredentials(user, input.password)))
      this.invalidCredentials();
    const refresh = this.sessions.createRefreshToken(user!.id, new Date());
    await this.repository.saveRefreshToken(refresh.entity);
    return this.sessions.createOutput(
      user!,
      refresh.rawToken,
      refresh.entity.expiresAt,
    );
  }

  async refresh(rawToken: string): Promise<AuthenticationOutput> {
    const current = await this.repository.findRefreshToken(hashToken(rawToken));
    const now = new Date();
    if (!current?.isActive(now)) this.invalidRefreshToken();
    const user = await this.repository.findActiveUserById(current!.userId);
    if (!user) this.unauthorized();
    const replacement = this.sessions.createRefreshToken(user!.id, now);
    await this.repository.replaceRefreshToken(
      current!.id,
      replacement.entity,
      now,
    );
    return this.sessions.createOutput(
      user!,
      replacement.rawToken,
      replacement.entity.expiresAt,
    );
  }

  async logout(rawToken?: string): Promise<void> {
    if (rawToken)
      await this.repository.revokeRefreshToken(hashToken(rawToken), new Date());
  }

  async authenticate(accessToken: string): Promise<User> {
    const { userId } = this.accessTokens.verify(accessToken);
    const user = await this.repository.findActiveUserById(userId);
    if (!user) this.unauthorized();
    return user!;
  }

  private async hasValidCredentials(
    user: User | null,
    password: string,
  ): Promise<boolean> {
    if (!user || user.status !== UserStatus.ACTIVE || !user.passwordHash)
      return false;
    return this.passwordHasher.verify(password, user.passwordHash);
  }

  private emailExists(): never {
    throw new BusinessException({
      code: ErrorCode.EMAIL_ALREADY_REGISTERED,
      message: 'An account with this email already exists',
    });
  }
  private invalidCredentials(): never {
    throw new BusinessException({
      code: ErrorCode.INVALID_CREDENTIALS,
      message: 'Email or password is incorrect',
    });
  }
  private invalidRefreshToken(): never {
    throw new BusinessException({
      code: ErrorCode.INVALID_REFRESH_TOKEN,
      message: 'Refresh token is invalid or expired',
    });
  }
  private unauthorized(): never {
    throw new BusinessException({
      code: ErrorCode.UNAUTHORIZED,
      message: 'Authentication is required',
    });
  }
}
