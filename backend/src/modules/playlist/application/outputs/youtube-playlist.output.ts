import type { MediaMetadataOutput } from './media-metadata.output.js';

export interface YoutubePlaylistOutput {
  sourceExternalId: string;
  sourceUrl: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  totalCount: number;
  items: (MediaMetadataOutput & { selectable: boolean })[];
  fetchedCount: number;
  availableCount: number;
  unavailableCount: number;
  skippedCount: number;
}
