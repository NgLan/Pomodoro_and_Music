import { ApiProperty } from '@nestjs/swagger';
import { MediaItemResponseDto } from './media-item.response.dto.js';

export class YoutubePlaylistPreviewItemDto extends MediaItemResponseDto {
  @ApiProperty() selectable!: boolean;
}

export class YoutubePlaylistPreviewResponseDto {
  @ApiProperty() sourceExternalId!: string;
  @ApiProperty() sourceUrl!: string;
  @ApiProperty() title!: string;
  @ApiProperty({ type: String, nullable: true }) description!: string | null;
  @ApiProperty({ type: String, nullable: true }) thumbnailUrl!: string | null;
  @ApiProperty() totalCount!: number;
  @ApiProperty({ type: [YoutubePlaylistPreviewItemDto] })
  items!: YoutubePlaylistPreviewItemDto[];
  @ApiProperty() fetchedCount!: number;
  @ApiProperty() availableCount!: number;
  @ApiProperty() unavailableCount!: number;
  @ApiProperty() skippedCount!: number;
}
