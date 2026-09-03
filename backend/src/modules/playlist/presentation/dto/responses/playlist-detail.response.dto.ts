import { ApiProperty } from '@nestjs/swagger';
import type { PlaylistDetailOutput } from '../../../application/outputs/playlist-detail.output.js';
import { PlaylistSourceType } from '../../../domain/enums/playlist-source-type.enum.js';
import { PlaylistItemResponseDto } from './playlist-item.response.dto.js';

export class PlaylistDetailResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty() name!: string;
  @ApiProperty({ nullable: true, type: String }) description!: string | null;
  @ApiProperty({ nullable: true, type: String, format: 'uri' }) thumbnailUrl!:
    string | null;
  @ApiProperty({ enum: PlaylistSourceType }) sourceType!: PlaylistSourceType;
  @ApiProperty({ nullable: true, type: String }) sourceUrl!: string | null;
  @ApiProperty({ type: [PlaylistItemResponseDto] })
  items!: PlaylistItemResponseDto[];
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;

  static fromOutput({
    playlist,
    items,
  }: PlaylistDetailOutput): PlaylistDetailResponseDto {
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      thumbnailUrl: playlist.thumbnailUrl,
      sourceType: playlist.sourceType,
      sourceUrl: playlist.sourceUrl,
      items: items.map(PlaylistItemResponseDto.fromOutput),
      createdAt: playlist.createdAt.toISOString(),
      updatedAt: playlist.updatedAt.toISOString(),
    };
  }
}
