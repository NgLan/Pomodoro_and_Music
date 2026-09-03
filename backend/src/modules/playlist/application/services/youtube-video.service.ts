import { Inject, Injectable } from '@nestjs/common';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import type { YoutubeVideoServiceInterface } from '../interfaces/youtube-video.service.interface.js';
import {
  YOUTUBE_MEDIA_PROVIDER,
  type YoutubeMediaProviderInterface,
} from '../interfaces/youtube-media.provider.interface.js';
import type { MediaMetadataOutput } from '../outputs/media-metadata.output.js';

@Injectable()
export class YoutubeVideoService implements YoutubeVideoServiceInterface {
  constructor(
    @Inject(YOUTUBE_MEDIA_PROVIDER)
    private readonly provider: YoutubeMediaProviderInterface,
  ) {}

  search(query: string): Promise<MediaMetadataOutput[]> {
    const normalizedQuery = query.trim();
    if (!normalizedQuery)
      throw new BusinessException({
        code: ErrorCode.INVALID_INPUT,
        message: 'Search query cannot be blank',
      });
    return this.provider.search(normalizedQuery);
  }

  resolve(url: string): Promise<MediaMetadataOutput> {
    return this.provider.resolveByUrl(url);
  }
}
