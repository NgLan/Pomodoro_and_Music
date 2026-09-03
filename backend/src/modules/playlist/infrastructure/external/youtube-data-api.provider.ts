import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { youtubeConfig } from '../../../../common/config/index.js';
import {
  BusinessException,
  ErrorCode,
  InfrastructureException,
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

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const REQUEST_TIMEOUT_MS = 8_000;

@Injectable()
export class YoutubeDataApiProvider implements YoutubeMediaProviderInterface {
  constructor(
    @Inject(youtubeConfig.KEY)
    private readonly config: ConfigType<typeof youtubeConfig>,
  ) {}

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

  private async request<T>(
    resource: string,
    parameters: Record<string, string>,
  ): Promise<T> {
    const url = new URL(`${YOUTUBE_API_URL}/${resource}`);
    Object.entries({ ...parameters, key: this.config.apiKey }).forEach(
      ([key, value]) => url.searchParams.set(key, value),
    );
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) this.providerFailure(response.status);
      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof InfrastructureException) throw error;
      throw new InfrastructureException({
        code: ErrorCode.YOUTUBE_PROVIDER_UNAVAILABLE,
        message: 'YouTube Data API request failed',
        cause: error,
      });
    }
  }

  private providerFailure(status: number): never {
    throw new InfrastructureException({
      code:
        status === 403 || status === 429
          ? ErrorCode.YOUTUBE_RATE_LIMITED
          : ErrorCode.YOUTUBE_PROVIDER_UNAVAILABLE,
      message: `YouTube Data API returned HTTP ${status}`,
    });
  }

  private unavailable(): never {
    throw new BusinessException({
      code: ErrorCode.MEDIA_UNAVAILABLE,
      message: 'The requested YouTube video is unavailable',
    });
  }
}
