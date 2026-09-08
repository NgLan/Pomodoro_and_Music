import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponses,
  ApiSuccessResponse,
} from '../../../../common/decorators/index.js';
import { CurrentUserId } from '../../../authentication/presentation/decorators/current-user-id.decorator.js';
import { AccessTokenGuard } from '../../../authentication/presentation/guards/access-token.guard.js';
import { YoutubePlaylistImportService } from '../../application/services/youtube-playlist-import.service.js';
import { YoutubePlaylistSyncService } from '../../application/services/youtube-playlist-sync.service.js';
import {
  YoutubePlaylistImportRequestDto,
  YoutubePlaylistPreviewRequestDto,
} from '../dto/requests/youtube-playlist.request.dto.js';
import { YoutubePlaylistPreviewResponseDto } from '../dto/responses/youtube-playlist-preview.response.dto.js';
import {
  YoutubePlaylistImportResponseDto,
  YoutubePlaylistSyncResponseDto,
} from '../dto/responses/youtube-playlist-result.response.dto.js';

@ApiTags('YouTube playlists')
@ApiBearerAuth('access-token')
@ApiErrorResponses()
@UseGuards(AccessTokenGuard)
@Controller()
export class YoutubePlaylistController {
  constructor(
    private readonly importer: YoutubePlaylistImportService,
    private readonly synchronizer: YoutubePlaylistSyncService,
  ) {}

  @Post('youtube/playlists/preview')
  @ApiOperation({
    operationId: 'youtubePlaylistPreview',
    summary: 'Preview a complete YouTube playlist without saving',
  })
  @ApiSuccessResponse(
    YoutubePlaylistPreviewResponseDto,
    'Playlist preview returned.',
  )
  preview(@Body() body: YoutubePlaylistPreviewRequestDto) {
    return this.importer.preview(body.url);
  }

  @Post('youtube/playlists/import')
  @ApiOperation({
    operationId: 'youtubePlaylistImport',
    summary: 'Import selected videos atomically into a personal playlist',
  })
  @ApiSuccessResponse(YoutubePlaylistImportResponseDto, 'Playlist imported.')
  import(
    @CurrentUserId() userId: string,
    @Body() body: YoutubePlaylistImportRequestDto,
  ) {
    return this.importer.import(userId, body);
  }

  @Post('playlists/:id/sync')
  @ApiOperation({
    operationId: 'youtubePlaylistSync',
    summary:
      'Append new source videos while preserving local edits and exclusions',
  })
  @ApiSuccessResponse(YoutubePlaylistSyncResponseDto, 'Playlist synchronized.')
  sync(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.synchronizer.sync(userId, id);
  }
}
