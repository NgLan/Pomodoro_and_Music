import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class AddVideoRequestDto {
  @ApiProperty({ example: 'jfKfPfyJRdk' })
  @IsString()
  @Matches(/^[\w-]{6,20}$/)
  externalVideoId!: string;
}
