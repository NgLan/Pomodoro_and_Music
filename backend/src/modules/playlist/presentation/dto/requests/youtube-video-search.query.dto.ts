import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class YoutubeVideoSearchQueryDto {
  @ApiProperty({ example: 'lofi study' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  query!: string;
}
