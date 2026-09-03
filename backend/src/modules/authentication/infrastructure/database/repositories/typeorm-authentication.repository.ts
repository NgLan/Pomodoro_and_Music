import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  BusinessException,
  ErrorCode,
} from '../../../../../common/exceptions/index.js';
import type { AuthenticationRepositoryInterface } from '../../../application/interfaces/authentication-repository.interface.js';
import type { RefreshToken } from '../../../domain/entities/refresh-token.entity.js';
import type { User } from '../../../../user/domain/entities/user.entity.js';
import { UserStatus } from '../../../../user/domain/enums/user-status.enum.js';
import { RefreshTokenOrmEntity } from '../entities/refresh-token.orm-entity.js';
import { UserOrmEntity } from '../entities/user.orm-entity.js';
import {
  toRefreshTokenDomain,
  toRefreshTokenPersistence,
} from '../mappers/refresh-token.mapper.js';
import { toUserDomain, toUserPersistence } from '../mappers/user.mapper.js';

@Injectable()
export class TypeOrmAuthenticationRepository implements AuthenticationRepositoryInterface {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly tokens: Repository<RefreshTokenOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const entity = await this.users.findOne({ where: { email } });
    return entity ? toUserDomain(entity) : null;
  }

  async findActiveUserById(id: string): Promise<User | null> {
    const entity = await this.users.findOne({
      where: { id, status: UserStatus.ACTIVE },
    });
    return entity ? toUserDomain(entity) : null;
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
    const entity = await this.tokens.findOne({ where: { tokenHash } });
    return entity ? toRefreshTokenDomain(entity) : null;
  }

  async createUserWithRefreshToken(
    user: User,
    token: RefreshToken,
  ): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.save(toUserPersistence(user));
        await manager.save(toRefreshTokenPersistence(token));
      });
    } catch (error) {
      this.rethrowRegistrationError(error);
    }
  }

  async saveRefreshToken(token: RefreshToken): Promise<void> {
    await this.tokens.save(toRefreshTokenPersistence(token));
  }

  async replaceRefreshToken(
    currentId: string,
    token: RefreshToken,
    at: Date,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const result = await manager
        .createQueryBuilder(RefreshTokenOrmEntity, 'token')
        .update()
        .set({ revokedAt: at })
        .where('id = :currentId AND revoked_at IS NULL AND expires_at > :at', {
          currentId,
          at,
        })
        .execute();
      if (result.affected !== 1) this.invalidRefreshToken();
      await manager.save(toRefreshTokenPersistence(token));
    });
  }

  async revokeRefreshToken(tokenHash: string, at: Date): Promise<void> {
    await this.tokens
      .createQueryBuilder()
      .update()
      .set({ revokedAt: at })
      .where('token_hash = :tokenHash AND revoked_at IS NULL', { tokenHash })
      .execute();
  }

  private rethrowRegistrationError(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    ) {
      throw new BusinessException({
        code: ErrorCode.EMAIL_ALREADY_REGISTERED,
        message: 'An account with this email already exists',
        cause: error,
      });
    }
    throw error;
  }

  private invalidRefreshToken(): never {
    throw new BusinessException({
      code: ErrorCode.INVALID_REFRESH_TOKEN,
      message: 'Refresh token is invalid or expired',
    });
  }
}
