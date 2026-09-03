import type { PlaylistItem } from '../../domain/entities/playlist-item.entity.js';
import type { PlaylistItemDetailOutput } from '../outputs/playlist-item-detail.output.js';

export const PLAYLIST_ITEM_REPOSITORY = Symbol('PLAYLIST_ITEM_REPOSITORY');

export interface PlaylistItemRepositoryInterface {
  findDetailed(playlistId: string): Promise<PlaylistItemDetailOutput[]>;
  append(item: PlaylistItem): Promise<void>;
  findById(playlistId: string, itemId: string): Promise<PlaylistItem | null>;
  remove(itemId: string): Promise<void>;
  reorder(items: readonly PlaylistItem[]): Promise<void>;
  copy(
    sourcePlaylistId: string,
    targetPlaylistId: string,
    now: Date,
  ): Promise<void>;
}
