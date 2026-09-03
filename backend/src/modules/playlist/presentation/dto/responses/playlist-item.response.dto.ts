import { ApiProperty } from '@nestjs/swagger';
import type { PlaylistItemDetailOutput } from '../../../application/outputs/playlist-item-detail.output.js';
import { MediaItemResponseDto } from './media-item.response.dto.js';

export class PlaylistItemResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty() position!: number;
  @ApiProperty({ type: MediaItemResponseDto }) media!: MediaItemResponseDto;

  static fromOutput({
    item,
    media,
  }: PlaylistItemDetailOutput): PlaylistItemResponseDto {
    return {
      id: item.id,
      position: item.position,
      media: MediaItemResponseDto.fromValue(media),
    };
  }
}
