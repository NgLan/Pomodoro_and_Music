import { Body, Controller, HttpCode, Inject, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { appConfig } from '../../../../common/config/index.js';
import { ApiErrorResponses, ApiSuccessResponse } from '../../../../common/decorators/index.js';
import type { AuthenticationOutput } from '../../application/outputs/authentication.output.js';
import { AuthenticationService } from '../../application/services/authentication.service.js';
import { clearRefreshTokenCookie, REFRESH_TOKEN_COOKIE, setRefreshTokenCookie } from '../cookies/refresh-token.cookie.js';
import { readCookie } from '../cookies/read-cookie.js';
import { LoginRequestDto } from '../dto/requests/login.request.dto.js';
import { RegisterRequestDto } from '../dto/requests/register.request.dto.js';
import { AuthSessionResponseDto } from '../dto/responses/auth-session.response.dto.js';
import { LogoutResponseDto } from '../dto/responses/logout.response.dto.js';

@ApiTags('Authentication')
@ApiErrorResponses()
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authentication: AuthenticationService,
    @Inject(appConfig.KEY) private readonly config: ConfigType<typeof appConfig>,
  ) {}

  @Post('register') @HttpCode(200)
  @ApiOperation({ operationId: 'authRegister', summary: 'Create a local account' })
  @ApiSuccessResponse(AuthSessionResponseDto, 'Account created and signed in.')
  async register(@Body() body: RegisterRequestDto, @Res({ passthrough: true }) response: Response) {
    return this.respondWithSession(response, await this.authentication.register(body));
  }

  @Post('login') @HttpCode(200)
  @ApiOperation({ operationId: 'authLogin', summary: 'Sign in with email and password' })
  @ApiSuccessResponse(AuthSessionResponseDto, 'Signed in successfully.')
  async login(@Body() body: LoginRequestDto, @Res({ passthrough: true }) response: Response) {
    return this.respondWithSession(response, await this.authentication.login(body));
  }

  @Post('refresh') @HttpCode(200)
  @ApiOperation({ operationId: 'authRefresh', summary: 'Rotate refresh token and issue a new access token' })
  @ApiSuccessResponse(AuthSessionResponseDto, 'Session refreshed.')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const token = readCookie(request, REFRESH_TOKEN_COOKIE);
    if (!token) throw new UnauthorizedException('Refresh token is required');
    return this.respondWithSession(response, await this.authentication.refresh(token));
  }

  @Post('logout') @HttpCode(200)
  @ApiOperation({ operationId: 'authLogout', summary: 'Revoke the current refresh token' })
  @ApiSuccessResponse(LogoutResponseDto, 'Signed out successfully.')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.authentication.logout(readCookie(request, REFRESH_TOKEN_COOKIE));
    clearRefreshTokenCookie(response);
    return { signedOut: true };
  }

  private respondWithSession(response: Response, output: AuthenticationOutput): AuthSessionResponseDto {
    setRefreshTokenCookie(response, output, this.config.nodeEnv === 'production');
    return AuthSessionResponseDto.fromOutput(output);
  }
}
