import { Inject, Injectable } from '@nestjs/common';
import {
  UNIT_OF_WORK,
  type UnitOfWork,
} from '../../../../infrastructure/database/transaction/unit-of-work.interface.js';
import type { ImportYoutubePlaylistInput } from '../inputs/import-youtube-playlist.input.js';
import {
  PLAYLIST_REPOSITORY,
  type PlaylistRepositoryInterface,
} from '../interfaces/playlist.repository.interface.js';
import {
  PLAYLIST_SOURCE_HISTORY,
  type PlaylistSourceHistoryRepositoryInterface,
} from '../interfaces/playlist-source-history.repository.interface.js';
import {
  YOUTUBE_PLAYLIST_PROVIDER,
  type YoutubePlaylistProviderInterface,
} from '../interfaces/youtube-playlist.provider.interface.js';
import { createImportedPlaylist } from './imported-playlist.factory.js';
import { selectImportedVideos } from './youtube-import-selection.js';
import { PlaylistImportWriter } from './playlist-import-writer.js';

@Injectable()
export class YoutubePlaylistImportService {
  constructor(
    @Inject(YOUTUBE_PLAYLIST_PROVIDER)
    private readonly provider: YoutubePlaylistProviderInterface,
    @Inject(PLAYLIST_REPOSITORY)
    private readonly playlists: PlaylistRepositoryInterface,
    @Inject(PLAYLIST_SOURCE_HISTORY)
    private readonly history: PlaylistSourceHistoryRepositoryInterface,
    @Inject(UNIT_OF_WORK) private readonly transaction: UnitOfWork,
    private readonly writer: PlaylistImportWriter,
  ) {}

  preview(url: string) {
    return this.provider.preview(url);
  }

  async import(userId: string, input: ImportYoutubePlaylistInput) {
    const source = await this.preview(input.url);
    const videos = selectImportedVideos(source, input.selectedVideoIds);
    const playlist = createImportedPlaylist(userId, input, source);
    return this.transaction.execute(async () => {
      await this.playlists.save(playlist);
      await this.writer.append(playlist.id, videos);
      await this.history.remember(
        playlist.id,
        source.items.map((item) => item.externalMediaId),
      );
      return {
        playlistId: playlist.id,
        importedCount: videos.length,
        skippedCount:
          input.selectedVideoIds.length - videos.length + source.skippedCount,
        unavailableCount: source.unavailableCount,
      };
    });
  }
}
