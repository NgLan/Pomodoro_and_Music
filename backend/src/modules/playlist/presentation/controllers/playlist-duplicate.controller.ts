import {
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
import { PlaylistService } from '../../application/services/playlist.service.js';
import { PlaylistDetailResponseDto } from '../dto/responses/playlist-detail.response.dto.js';

@ApiTags('Playlists')
@ApiBearerAuth('access-token')
@ApiErrorResponses()
@UseGuards(AccessTokenGuard)
@Controller('playlists/:id/duplicate')
export class PlaylistDuplicateController {
  constructor(private readonly service: PlaylistService) {}

  @Post()
  @ApiOperation({
    operationId: 'playlistDuplicate',
    summary: 'Duplicate playlist and ordered items',
  })
  @ApiSuccessResponse(PlaylistDetailResponseDto, 'Playlist duplicated.')
  async duplicate(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return PlaylistDetailResponseDto.fromOutput(
      await this.service.duplicate(userId, id),
    );
  }
}
