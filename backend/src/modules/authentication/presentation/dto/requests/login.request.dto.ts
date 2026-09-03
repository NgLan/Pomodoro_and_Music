import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'hello@example.com' })
  @IsEmail() @MaxLength(320)
  email!: string;

  @ApiProperty({ example: 'Cappucino#2026', maxLength: 128 })
  @IsString() @MaxLength(128)
  password!: string;
}
