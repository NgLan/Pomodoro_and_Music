import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { youtubeConfig } from '../../../../common/config/index.js';
import {
  ErrorCode,
  InfrastructureException,
} from '../../../../common/exceptions/index.js';
import {
  isYoutubeFailure,
  malformedYoutubeResponse,
} from './youtube-api-error.js';
import { readYoutubeResponse } from './youtube-response.reader.js';

const REQUEST_TIMEOUT_MS = 8_000;
const MAX_RETRIES = 1;

@Injectable()
export class YoutubeApiClient {
  constructor(
    @Inject(youtubeConfig.KEY)
    private readonly config: ConfigType<typeof youtubeConfig>,
  ) {}

  request<T>(resource: string, parameters: Record<string, string>): Promise<T> {
    const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);
    Object.entries({ ...parameters, key: this.config.apiKey }).forEach(
      ([key, value]) => url.searchParams.set(key, value),
    );
    return this.fetchWithRetry<T>(url);
  }

  malformed(): never {
    return malformedYoutubeResponse();
  }

  private async fetchWithRetry<T>(url: URL): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        if (response.status >= 500 && attempt < MAX_RETRIES) continue;
        return await readYoutubeResponse<T>(response);
      } catch (error) {
        if (isYoutubeFailure(error)) throw error;
        if (attempt < MAX_RETRIES) continue;
        throw new InfrastructureException({
          code: ErrorCode.YOUTUBE_PROVIDER_UNAVAILABLE,
          message: 'YouTube request failed',
        });
      }
    }
  }
}
