import type { PlaylistMetadataInput } from '../inputs/playlist-metadata.input.js';
import type { PlaylistSearchInput } from '../inputs/playlist-search.input.js';
import type { PlaylistDetailOutput } from '../outputs/playlist-detail.output.js';
import type { PlaylistSummaryOutput } from '../outputs/playlist-summary.output.js';

export interface PlaylistServiceInterface {
  create(
    userId: string,
    input: PlaylistMetadataInput,
  ): Promise<PlaylistDetailOutput>;
  list(
    userId: string,
    input: PlaylistSearchInput,
  ): Promise<PlaylistSummaryOutput[]>;
  get(userId: string, id: string): Promise<PlaylistDetailOutput>;
  update(
    userId: string,
    id: string,
    input: PlaylistMetadataInput,
  ): Promise<PlaylistDetailOutput>;
  delete(userId: string, id: string): Promise<void>;
  duplicate(userId: string, id: string): Promise<PlaylistDetailOutput>;
}
