import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponses,
  ApiSuccessResponse,
} from '../../../../common/decorators/index.js';
import { CurrentUserId } from '../../../authentication/presentation/decorators/current-user-id.decorator.js';
import { AccessTokenGuard } from '../../../authentication/presentation/guards/access-token.guard.js';
import { PlaylistItemService } from '../../application/services/playlist-item.service.js';
import { AddVideoRequestDto } from '../dto/requests/add-video.request.dto.js';
import { ReorderPlaylistItemsRequestDto } from '../dto/requests/reorder-playlist-items.request.dto.js';
import { PlaylistDetailResponseDto } from '../dto/responses/playlist-detail.response.dto.js';

@ApiTags('Playlist items')
@ApiBearerAuth('access-token')
@ApiErrorResponses()
@UseGuards(AccessTokenGuard)
@Controller('playlists/:id/items')
export class PlaylistItemController {
  constructor(private readonly service: PlaylistItemService) {}

  @Post()
  @ApiOperation({
    operationId: 'playlistItemAdd',
    summary: 'Resolve and append one YouTube video',
  })
  @ApiSuccessResponse(PlaylistDetailResponseDto, 'Video added.')
  async add(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AddVideoRequestDto,
  ) {
    return PlaylistDetailResponseDto.fromOutput(
      await this.service.add(userId, id, body),
    );
  }

  @Delete(':itemId')
  @ApiOperation({
    operationId: 'playlistItemDelete',
    summary: 'Remove one item and normalize positions',
  })
  @ApiSuccessResponse(PlaylistDetailResponseDto, 'Playlist item removed.')
  async delete(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return PlaylistDetailResponseDto.fromOutput(
      await this.service.remove(userId, id, itemId),
    );
  }

  @Put('order')
  @ApiOperation({
    operationId: 'playlistItemReorder',
    summary: 'Atomically save the complete item order',
  })
  @ApiSuccessResponse(PlaylistDetailResponseDto, 'Playlist order updated.')
  async reorder(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: ReorderPlaylistItemsRequestDto,
  ) {
    return PlaylistDetailResponseDto.fromOutput(
      await this.service.reorder(userId, id, body),
    );
  }
}
