import type { YoutubePlaylistOutput } from '../outputs/youtube-playlist.output.js';

export const YOUTUBE_PLAYLIST_PROVIDER = Symbol('YOUTUBE_PLAYLIST_PROVIDER');
export interface YoutubePlaylistProviderInterface {
  preview(url: string): Promise<YoutubePlaylistOutput>;
}
