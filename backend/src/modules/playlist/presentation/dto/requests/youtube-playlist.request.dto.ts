import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class YoutubePlaylistPreviewRequestDto {
  @ApiProperty({ example: 'https://www.youtube.com/playlist?list=PLexample' })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2048)
  url!: string;
}

export class YoutubePlaylistImportRequestDto extends YoutubePlaylistPreviewRequestDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Matches(/^[\w-]{6,20}$/, { each: true })
  selectedVideoIds!: string[];

  @ApiPropertyOptional({ maxLength: 255 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;
}
