import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

export class RegisterRequestDto {
  @ApiProperty({ example: 'hello@example.com' })
  @IsEmail() @MaxLength(320)
  email!: string;

  @ApiProperty({ example: 'Cappucino#2026', minLength: 8, maxLength: 128 })
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: 'password must include uppercase, lowercase, number, and special character' })
  password!: string;

  @ApiProperty({ example: 'Nguyen An', required: false })
  @IsOptional() @IsString() @MaxLength(120)
  displayName?: string;
}
