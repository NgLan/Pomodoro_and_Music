import { ApiProperty } from '@nestjs/swagger';
import { PlaylistSourceType } from '../../../domain/enums/playlist-source-type.enum.js';
import type { PlaylistSummaryOutput } from '../../../application/outputs/playlist-summary.output.js';

export class PlaylistSummaryResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty() name!: string;
  @ApiProperty({ nullable: true, type: String }) description!: string | null;
  @ApiProperty({ nullable: true, type: String, format: 'uri' }) thumbnailUrl!:
    string | null;
  @ApiProperty({ enum: PlaylistSourceType }) sourceType!: PlaylistSourceType;
  @ApiProperty() itemCount!: number;
  @ApiProperty({ nullable: true, type: Number }) totalDurationSeconds!:
    number | null;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;

  static fromOutput({
    playlist,
    itemCount,
    totalDurationSeconds,
  }: PlaylistSummaryOutput): PlaylistSummaryResponseDto {
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      thumbnailUrl: playlist.thumbnailUrl,
      sourceType: playlist.sourceType,
      itemCount,
      totalDurationSeconds,
      updatedAt: playlist.updatedAt.toISOString(),
    };
  }
}
