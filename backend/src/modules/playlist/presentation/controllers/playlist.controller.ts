import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponses,
  ApiListResponse,
  ApiSuccessResponse,
} from '../../../../common/decorators/index.js';
import { CurrentUserId } from '../../../authentication/presentation/decorators/current-user-id.decorator.js';
import { AccessTokenGuard } from '../../../authentication/presentation/guards/access-token.guard.js';
import { PlaylistService } from '../../application/services/playlist.service.js';
import { PlaylistMetadataRequestDto } from '../dto/requests/playlist-metadata.request.dto.js';
import { PlaylistSearchQueryDto } from '../dto/requests/playlist-search.query.dto.js';
import { DeletePlaylistResponseDto } from '../dto/responses/delete-playlist.response.dto.js';
import { PlaylistDetailResponseDto } from '../dto/responses/playlist-detail.response.dto.js';
import { PlaylistSummaryResponseDto } from '../dto/responses/playlist-summary.response.dto.js';

@ApiTags('Playlists')
@ApiBearerAuth('access-token')
@ApiErrorResponses()
@UseGuards(AccessTokenGuard)
@Controller('playlists')
export class PlaylistController {
  constructor(private readonly service: PlaylistService) {}

  @Post()
  @ApiOperation({
    operationId: 'playlistCreate',
    summary: 'Create a personal playlist',
  })
  @ApiSuccessResponse(PlaylistDetailResponseDto, 'Playlist created.')
  async create(
    @CurrentUserId() userId: string,
    @Body() body: PlaylistMetadataRequestDto,
  ) {
    return PlaylistDetailResponseDto.fromOutput(
      await this.service.create(userId, body),
    );
  }

  @Get()
  @ApiOperation({
    operationId: 'playlistList',
    summary: 'List and search my playlists',
  })
  @ApiListResponse(PlaylistSummaryResponseDto, 'Playlists returned.')
  async list(
    @CurrentUserId() userId: string,
    @Query() query: PlaylistSearchQueryDto,
  ) {
    const values = await this.service.list(userId, query);
    return values.map(PlaylistSummaryResponseDto.fromOutput);
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'playlistGet',
    summary: 'Get playlist detail and ordered items',
  })
  @ApiSuccessResponse(PlaylistDetailResponseDto, 'Playlist returned.')
  async get(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return PlaylistDetailResponseDto.fromOutput(
      await this.service.get(userId, id),
    );
  }

  @Put(':id')
  @ApiOperation({
    operationId: 'playlistUpdate',
    summary: 'Update playlist metadata',
  })
  @ApiSuccessResponse(PlaylistDetailResponseDto, 'Playlist updated.')
  async update(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: PlaylistMetadataRequestDto,
  ) {
    return PlaylistDetailResponseDto.fromOutput(
      await this.service.update(userId, id, body),
    );
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'playlistDelete',
    summary: 'Delete only the internal playlist copy',
  })
  @ApiSuccessResponse(DeletePlaylistResponseDto, 'Playlist deleted.')
  async delete(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.service.delete(userId, id);
    return { deleted: true };
  }
}
