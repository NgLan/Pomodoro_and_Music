import { markPlaylistSynced } from './imported-playlist.factory.js';
import type { YoutubePlaylistOutput } from '../outputs/youtube-playlist.output.js';
import { Inject, Injectable } from '@nestjs/common';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import {
  UNIT_OF_WORK,
  type UnitOfWork,
} from '../../../../infrastructure/database/transaction/unit-of-work.interface.js';
import { Playlist } from '../../domain/entities/playlist.entity.js';
import { PlaylistSourceType } from '../../domain/enums/playlist-source-type.enum.js';
import {
  PLAYLIST_REPOSITORY,
  type PlaylistRepositoryInterface,
} from '../interfaces/playlist.repository.interface.js';
import {
  PLAYLIST_ITEM_REPOSITORY,
  type PlaylistItemRepositoryInterface,
} from '../interfaces/playlist-item.repository.interface.js';
import {
  PLAYLIST_SOURCE_HISTORY,
  type PlaylistSourceHistoryRepositoryInterface,
} from '../interfaces/playlist-source-history.repository.interface.js';
import {
  YOUTUBE_PLAYLIST_PROVIDER,
  type YoutubePlaylistProviderInterface,
} from '../interfaces/youtube-playlist.provider.interface.js';
import { PlaylistImportWriter } from './playlist-import-writer.js';

@Injectable()
export class YoutubePlaylistSyncService {
  constructor(
    @Inject(YOUTUBE_PLAYLIST_PROVIDER)
    private readonly provider: YoutubePlaylistProviderInterface,
    @Inject(PLAYLIST_REPOSITORY)
    private readonly playlists: PlaylistRepositoryInterface,
    @Inject(PLAYLIST_ITEM_REPOSITORY)
    private readonly items: PlaylistItemRepositoryInterface,
    @Inject(PLAYLIST_SOURCE_HISTORY)
    private readonly history: PlaylistSourceHistoryRepositoryInterface,
    @Inject(UNIT_OF_WORK) private readonly transaction: UnitOfWork,
    private readonly writer: PlaylistImportWriter,
  ) {}

  async sync(userId: string, id: string) {
    const original = await this.requireSource(userId, id);
    const source = await this.provider.preview(original.sourceUrl!);
    return this.transaction.execute(async () => {
      const playlist = await this.requireSource(userId, id);
      return this.appendSource(playlist, source);
    });
  }

  private async appendSource(
    playlist: Playlist,
    source: YoutubePlaylistOutput,
  ) {
    const id = playlist.id;
    const current = await this.items.findDetailed(id);
    const seen = new Set([
      ...(await this.history.read(id)),
      ...current.map((item) => item.media.externalMediaId),
    ]);
    const videos = source.items.filter(
      (item) => item.selectable && !seen.has(item.externalMediaId),
    );
    await this.writer.append(id, videos, current.length);
    const syncedAt = await this.saveSync(playlist, source);
    return {
      addedCount: videos.length,
      skippedCount: source.skippedCount,
      unavailableCount: source.unavailableCount,
      syncedAt: syncedAt.toISOString(),
    };
  }

  private async saveSync(playlist: Playlist, source: YoutubePlaylistOutput) {
    const ids = source.items
      .filter((item) => item.selectable)
      .map((item) => item.externalMediaId);
    await this.history.remember(playlist.id, ids);
    const syncedAt = new Date();
    await this.playlists.save(markPlaylistSynced(playlist, syncedAt));
    return syncedAt;
  }

  private async requireSource(userId: string, id: string) {
    const playlist = await this.playlists.findByIdForUser(id, userId);
    if (!playlist)
      throw new BusinessException({
        code: ErrorCode.PLAYLIST_NOT_FOUND,
        message: 'Playlist not found',
      });
    if (
      playlist.sourceType !== PlaylistSourceType.YOUTUBE ||
      !playlist.sourceUrl
    )
      throw new BusinessException({
        code: ErrorCode.INVALID_INPUT,
        message: 'Playlist has no YouTube source',
      });
    return playlist;
  }
}
