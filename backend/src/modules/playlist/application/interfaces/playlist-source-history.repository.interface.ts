export const PLAYLIST_SOURCE_HISTORY = Symbol('PLAYLIST_SOURCE_HISTORY');
export interface PlaylistSourceHistoryRepositoryInterface {
  read(playlistId: string): Promise<string[]>;
  remember(playlistId: string, videoIds: string[]): Promise<void>;
}
