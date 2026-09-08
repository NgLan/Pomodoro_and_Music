import { YoutubeApiClient } from './youtube-api.client.js';
import { Injectable } from '@nestjs/common';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import type { YoutubeMediaProviderInterface } from '../../application/interfaces/youtube-media.provider.interface.js';
import type { MediaMetadataOutput } from '../../application/outputs/media-metadata.output.js';
import type {
  YoutubeListResponse,
  YoutubeSearchItem,
  YoutubeVideoItem,
} from './youtube-api.types.js';
import { parseYoutubeVideoId } from './youtube-url.parser.js';
import { mapYoutubeVideo } from './youtube-video.mapper.js';

@Injectable()
export class YoutubeDataApiProvider implements YoutubeMediaProviderInterface {
  constructor(private readonly client: YoutubeApiClient) {}

  async search(query: string): Promise<MediaMetadataOutput[]> {
    const response = await this.request<YoutubeListResponse<YoutubeSearchItem>>(
      'search',
      {
        part: 'snippet',
        type: 'video',
        maxResults: '12',
        q: query,
      },
    );
    const ids = (response.items ?? []).flatMap(
      (item) => item.id?.videoId ?? [],
    );
    if (!ids.length) return [];
    const metadata = await this.readVideos(ids);
    const byId = new Map(metadata.map((item) => [item.externalMediaId, item]));
    return ids.flatMap((id) => byId.get(id) ?? []);
  }

  async resolveById(videoId: string): Promise<MediaMetadataOutput> {
    const [metadata] = await this.readVideos([videoId]);
    if (!metadata) this.unavailable();
    return metadata!;
  }

  resolveByUrl(url: string): Promise<MediaMetadataOutput> {
    return this.resolveById(parseYoutubeVideoId(url));
  }

  private async readVideos(ids: string[]): Promise<MediaMetadataOutput[]> {
    const response = await this.request<YoutubeListResponse<YoutubeVideoItem>>(
      'videos',
      {
        part: 'snippet,contentDetails,status',
        id: ids.join(','),
      },
    );
    return (response.items ?? []).map(mapYoutubeVideo);
  }

  private request<T>(
    resource: string,
    parameters: Record<string, string>,
  ): Promise<T> {
    return this.client.request<T>(resource, parameters);
  }

  private unavailable(): never {
    throw new BusinessException({
      code: ErrorCode.MEDIA_UNAVAILABLE,
      message: 'The requested YouTube video is unavailable',
    });
  }
}
