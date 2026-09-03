import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PlaylistSearchQueryDto {
  @ApiPropertyOptional({
    description: 'Search in playlist name and description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
