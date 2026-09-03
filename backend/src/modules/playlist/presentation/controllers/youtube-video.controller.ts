import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponses,
  ApiListResponse,
  ApiSuccessResponse,
} from '../../../../common/decorators/index.js';
import { AccessTokenGuard } from '../../../authentication/presentation/guards/access-token.guard.js';
import { YoutubeVideoService } from '../../application/services/youtube-video.service.js';
import { ResolveYoutubeVideoRequestDto } from '../dto/requests/resolve-youtube-video.request.dto.js';
import { YoutubeVideoSearchQueryDto } from '../dto/requests/youtube-video-search.query.dto.js';
import { MediaItemResponseDto } from '../dto/responses/media-item.response.dto.js';

@ApiTags('YouTube videos')
@ApiBearerAuth('access-token')
@ApiErrorResponses()
@UseGuards(AccessTokenGuard)
@Controller('youtube/videos')
export class YoutubeVideoController {
  constructor(private readonly service: YoutubeVideoService) {}

  @Get()
  @ApiOperation({
    operationId: 'youtubeVideoSearch',
    summary: 'Search public YouTube videos',
  })
  @ApiListResponse(MediaItemResponseDto, 'YouTube videos returned.')
  async search(@Query() query: YoutubeVideoSearchQueryDto) {
    const values = await this.service.search(query.query);
    return values.map(MediaItemResponseDto.fromValue);
  }

  @Post('resolve')
  @ApiOperation({
    operationId: 'youtubeVideoResolve',
    summary: 'Resolve a YouTube video URL',
  })
  @ApiSuccessResponse(MediaItemResponseDto, 'YouTube video metadata returned.')
  async resolve(@Body() body: ResolveYoutubeVideoRequestDto) {
    return MediaItemResponseDto.fromValue(await this.service.resolve(body.url));
  }
}
