import type { MediaMetadataOutput } from '../outputs/media-metadata.output.js';

export interface YoutubeVideoServiceInterface {
  search(query: string): Promise<MediaMetadataOutput[]>;
  resolve(url: string): Promise<MediaMetadataOutput>;
}
