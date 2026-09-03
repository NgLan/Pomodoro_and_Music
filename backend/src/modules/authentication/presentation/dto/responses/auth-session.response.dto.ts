import { ApiProperty } from '@nestjs/swagger';
import type { AuthenticationOutput } from '../../../application/outputs/authentication.output.js';
import { AuthUserResponseDto } from './auth-user.response.dto.js';

export class AuthSessionResponseDto {
  @ApiProperty() accessToken!: string;
  @ApiProperty({ example: 900 }) accessTokenExpiresInSeconds!: number;
  @ApiProperty({ type: AuthUserResponseDto }) user!: AuthUserResponseDto;

  static fromOutput(value: AuthenticationOutput): AuthSessionResponseDto {
    const { id, email, displayName } = value.user;
    return {
      accessToken: value.accessToken,
      accessTokenExpiresInSeconds: value.accessTokenExpiresInSeconds,
      user: { id, email, displayName },
    };
  }
}
