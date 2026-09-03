import type { MediaMetadataOutput } from '../outputs/media-metadata.output.js';

export const YOUTUBE_MEDIA_PROVIDER = Symbol('YOUTUBE_MEDIA_PROVIDER');

export interface YoutubeMediaProviderInterface {
  search(query: string): Promise<MediaMetadataOutput[]>;
  resolveById(videoId: string): Promise<MediaMetadataOutput>;
  resolveByUrl(url: string): Promise<MediaMetadataOutput>;
}
