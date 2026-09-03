import type { AddVideoInput } from '../inputs/add-video.input.js';
import type { ReorderPlaylistItemsInput } from '../inputs/reorder-playlist-items.input.js';
import type { PlaylistDetailOutput } from '../outputs/playlist-detail.output.js';

export interface PlaylistItemServiceInterface {
  add(
    userId: string,
    id: string,
    input: AddVideoInput,
  ): Promise<PlaylistDetailOutput>;
  remove(
    userId: string,
    id: string,
    itemId: string,
  ): Promise<PlaylistDetailOutput>;
  reorder(
    userId: string,
    id: string,
    input: ReorderPlaylistItemsInput,
  ): Promise<PlaylistDetailOutput>;
}
