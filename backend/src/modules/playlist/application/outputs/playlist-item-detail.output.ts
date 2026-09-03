import type { MediaItem } from '../../domain/entities/media-item.entity.js';
import type { PlaylistItem } from '../../domain/entities/playlist-item.entity.js';

export interface PlaylistItemDetailOutput {
  item: PlaylistItem;
  media: MediaItem;
}
