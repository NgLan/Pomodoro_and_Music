import { Inject, Injectable } from '@nestjs/common';
import {
  MEDIA_ITEM_REPOSITORY,
  type MediaItemRepositoryInterface,
} from '../interfaces/media-item.repository.interface.js';
import {
  PLAYLIST_ITEM_REPOSITORY,
  type PlaylistItemRepositoryInterface,
} from '../interfaces/playlist-item.repository.interface.js';
import type { MediaMetadataOutput } from '../outputs/media-metadata.output.js';
import { createMedia, createPlaylistItem } from './playlist.factory.js';

@Injectable()
export class PlaylistImportWriter {
  constructor(
    @Inject(MEDIA_ITEM_REPOSITORY)
    private readonly media: MediaItemRepositoryInterface,
    @Inject(PLAYLIST_ITEM_REPOSITORY)
    private readonly items: PlaylistItemRepositoryInterface,
  ) {}

  async append(
    playlistId: string,
    videos: MediaMetadataOutput[],
    position = 0,
  ): Promise<void> {
    for (const video of videos) {
      const media = await this.media.save(createMedia(video));
      await this.items.append(
        createPlaylistItem(playlistId, media.id, position++),
      );
    }
  }
}
