import type { Playlist } from '../../domain/entities/playlist.entity.js';
import type { PlaylistItemDetailOutput } from './playlist-item-detail.output.js';

export interface PlaylistDetailOutput {
  playlist: Playlist;
  items: PlaylistItemDetailOutput[];
}
