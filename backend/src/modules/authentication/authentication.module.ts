import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ACCESS_TOKEN_PROVIDER } from './application/interfaces/access-token-provider.interface.js';
import { AUTHENTICATION_REPOSITORY } from './application/interfaces/authentication-repository.interface.js';
import { PASSWORD_HASHER } from './application/interfaces/password-hasher.interface.js';
import { AuthenticationService } from './application/services/authentication.service.js';
import { SessionFactory } from './application/services/session.factory.js';
import { RefreshTokenOrmEntity } from './infrastructure/database/entities/refresh-token.orm-entity.js';
import { UserOrmEntity } from './infrastructure/database/entities/user.orm-entity.js';
import { TypeOrmAuthenticationRepository } from './infrastructure/database/repositories/typeorm-authentication.repository.js';
import { HmacAccessTokenProvider } from './infrastructure/security/hmac-access-token.provider.js';
import { ScryptPasswordHasher } from './infrastructure/security/scrypt-password-hasher.js';
import { AuthenticationController } from './presentation/controllers/authentication.controller.js';
import { AccessTokenGuard } from './presentation/guards/access-token.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, RefreshTokenOrmEntity])],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    SessionFactory,
    AccessTokenGuard,
    TypeOrmAuthenticationRepository,
    ScryptPasswordHasher,
    HmacAccessTokenProvider,
    {
      provide: AUTHENTICATION_REPOSITORY,
      useExisting: TypeOrmAuthenticationRepository,
    },
    { provide: PASSWORD_HASHER, useExisting: ScryptPasswordHasher },
    { provide: ACCESS_TOKEN_PROVIDER, useExisting: HmacAccessTokenProvider },
  ],
  exports: [AuthenticationService, AccessTokenGuard],
})
export class AuthenticationModule {}
