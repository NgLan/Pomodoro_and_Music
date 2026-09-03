import { ApiProperty } from '@nestjs/swagger';
import type { MediaItem } from '../../../domain/entities/media-item.entity.js';
import { MediaAvailability } from '../../../domain/enums/media-availability.enum.js';
import type { MediaMetadataOutput } from '../../../application/outputs/media-metadata.output.js';

export class MediaItemResponseDto {
  @ApiProperty() externalMediaId!: string;
  @ApiProperty({ nullable: true, type: String }) title!: string | null;
  @ApiProperty({ nullable: true, type: String }) channelName!: string | null;
  @ApiProperty({ nullable: true, type: String, format: 'uri' }) thumbnailUrl!:
    string | null;
  @ApiProperty({ nullable: true, type: Number }) durationSeconds!:
    number | null;
  @ApiProperty({ format: 'uri' }) sourceUrl!: string;
  @ApiProperty({ enum: MediaAvailability }) availability!: MediaAvailability;

  static fromValue(
    value: MediaItem | MediaMetadataOutput,
  ): MediaItemResponseDto {
    return {
      externalMediaId: value.externalMediaId,
      title: value.title,
      channelName: value.channelName,
      thumbnailUrl: value.thumbnailUrl,
      durationSeconds: value.durationSeconds,
      sourceUrl: value.sourceUrl,
      availability: value.availability,
    };
  }
}
