import {
  mapPlaylistPreview,
  unavailablePlaylistVideo,
} from './youtube-playlist.mapper.js';
import { Injectable } from '@nestjs/common';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import type { YoutubePlaylistProviderInterface } from '../../application/interfaces/youtube-playlist.provider.interface.js';
import type { YoutubePlaylistOutput } from '../../application/outputs/youtube-playlist.output.js';
import { MediaAvailability } from '../../domain/enums/media-availability.enum.js';
import { YoutubeApiClient } from './youtube-api.client.js';
import type {
  YoutubeListResponse,
  YoutubeVideoItem,
} from './youtube-api.types.js';
import type { YoutubePlaylistPage } from './youtube-playlist.types.js';
import { parseYoutubePlaylistId } from './youtube-playlist-url.parser.js';
import { mapYoutubeVideo } from './youtube-video.mapper.js';

@Injectable()
export class YoutubePlaylistProvider implements YoutubePlaylistProviderInterface {
  constructor(private readonly client: YoutubeApiClient) {}

  async preview(url: string): Promise<YoutubePlaylistOutput> {
    const id = parseYoutubePlaylistId(url);
    const response = await this.client.request<YoutubePlaylistPage>(
      'playlists',
      { part: 'snippet,contentDetails', id },
    );
    const source = response.items[0];
    if (!source)
      throw new BusinessException({
        code: ErrorCode.YOUTUBE_PLAYLIST_NOT_FOUND,
        message: 'Source playlist not found or inaccessible',
      });
    const entries = await this.readEntries(id);
    const items = await this.readMetadata(entries);
    return mapPlaylistPreview(id, source, items, entries.length);
  }

  private async readEntries(playlistId: string) {
    const entries: YoutubePlaylistPage['items'] = [];
    const tokens = new Set<string>();
    let pageToken = '';
    do {
      if (tokens.has(pageToken)) this.client.malformed();
      tokens.add(pageToken);
      const page = await this.client.request<YoutubePlaylistPage>(
        'playlistItems',
        {
          part: 'snippet',
          playlistId,
          maxResults: '50',
          ...(pageToken ? { pageToken } : {}),
        },
      );
      entries.push(...page.items);
      pageToken = page.nextPageToken ?? '';
    } while (pageToken);
    return entries;
  }

  private async readMetadata(entries: YoutubePlaylistPage['items']) {
    const ids = [
      ...new Set(
        entries.flatMap((item) => item.snippet?.resourceId?.videoId ?? []),
      ),
    ];
    const metadata = await this.readVideoBatches(ids);
    return ids.map((id) => {
      const value = metadata.get(id) ?? unavailablePlaylistVideo(id);
      return {
        ...value,
        selectable: value.availability === MediaAvailability.AVAILABLE,
      };
    });
  }

  private async readVideoBatches(ids: string[]) {
    const metadata = new Map<string, ReturnType<typeof mapYoutubeVideo>>();
    for (let offset = 0; offset < ids.length; offset += 50) {
      const page = await this.client.request<
        YoutubeListResponse<YoutubeVideoItem>
      >('videos', {
        part: 'snippet,contentDetails,status',
        id: ids.slice(offset, offset + 50).join(','),
      });
      for (const item of page.items ?? []) {
        if (!item.id) this.client.malformed();
        metadata.set(item.id, mapYoutubeVideo(item));
      }
    }
    return metadata;
  }
}
