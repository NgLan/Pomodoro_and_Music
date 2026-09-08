import { ApiProperty } from '@nestjs/swagger';

export class YoutubePlaylistImportResponseDto {
  @ApiProperty({ format: 'uuid' }) playlistId!: string;
  @ApiProperty() importedCount!: number;
  @ApiProperty() skippedCount!: number;
  @ApiProperty() unavailableCount!: number;
}

export class YoutubePlaylistSyncResponseDto {
  @ApiProperty() addedCount!: number;
  @ApiProperty() skippedCount!: number;
  @ApiProperty() unavailableCount!: number;
  @ApiProperty({ format: 'date-time' }) syncedAt!: string;
}
