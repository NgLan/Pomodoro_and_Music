import type { Playlist } from '../../domain/entities/playlist.entity.js';

export interface PlaylistSummaryOutput {
  playlist: Playlist;
  itemCount: number;
  totalDurationSeconds: number | null;
}
