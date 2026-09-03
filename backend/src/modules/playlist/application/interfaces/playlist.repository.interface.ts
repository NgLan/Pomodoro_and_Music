import type { Playlist } from '../../domain/entities/playlist.entity.js';
import type { PlaylistSummaryOutput } from '../outputs/playlist-summary.output.js';

export const PLAYLIST_REPOSITORY = Symbol('PLAYLIST_REPOSITORY');

export interface PlaylistRepositoryInterface {
  save(playlist: Playlist): Promise<void>;
  findByIdForUser(id: string, userId: string): Promise<Playlist | null>;
  findAllForUser(
    userId: string,
    search?: string,
  ): Promise<PlaylistSummaryOutput[]>;
  deleteForUser(id: string, userId: string): Promise<boolean>;
}
