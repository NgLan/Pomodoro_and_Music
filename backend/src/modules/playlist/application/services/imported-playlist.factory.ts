import { Playlist } from '../../domain/entities/playlist.entity.js';
import { PlaylistSourceType } from '../../domain/enums/playlist-source-type.enum.js';
import type { ImportYoutubePlaylistInput } from '../inputs/import-youtube-playlist.input.js';
import type { YoutubePlaylistOutput } from '../outputs/youtube-playlist.output.js';
import { createPlaylist } from './playlist.factory.js';

export function createImportedPlaylist(
  userId: string,
  input: ImportYoutubePlaylistInput,
  source: YoutubePlaylistOutput,
) {
  const base = createPlaylist(userId, {
    name: input.name ?? source.title.slice(0, 255),
    description: source.description,
    thumbnailUrl: source.thumbnailUrl,
  });
  return Playlist.create({
    ...base,
    createdAt: base.createdAt,
    updatedAt: base.updatedAt,
    sourceType: PlaylistSourceType.YOUTUBE,
    sourceExternalId: source.sourceExternalId,
    sourceUrl: source.sourceUrl,
    lastSyncedAt: new Date(),
  });
}

export function markPlaylistSynced(playlist: Playlist, syncedAt: Date) {
  return Playlist.create({
    ...playlist,
    createdAt: playlist.createdAt,
    updatedAt: syncedAt,
    lastSyncedAt: syncedAt,
  });
}
