import { vi } from 'vitest';
import { MediaAvailability } from '../../../src/modules/playlist/domain/enums/media-availability.enum.js';
import { PlaylistSourceType } from '../../../src/modules/playlist/domain/enums/playlist-source-type.enum.js';
import { Playlist } from '../../../src/modules/playlist/domain/entities/playlist.entity.js';
import { createPlaylist } from '../../../src/modules/playlist/application/services/playlist.factory.js';
import { YoutubePlaylistImportService } from '../../../src/modules/playlist/application/services/youtube-playlist-import.service.js';
import { YoutubePlaylistSyncService } from '../../../src/modules/playlist/application/services/youtube-playlist-sync.service.js';
import { PlaylistImportWriter } from '../../../src/modules/playlist/application/services/playlist-import-writer.js';
import type { YoutubePlaylistOutput } from '../../../src/modules/playlist/application/outputs/youtube-playlist.output.js';

export function video(id: string, selectable = true) {
  return {
    externalMediaId: id,
    title: id,
    channelName: null,
    thumbnailUrl: null,
    durationSeconds: 100,
    sourceUrl: `https://www.youtube.com/watch?v=${id}`,
    selectable,
    availability: selectable
      ? MediaAvailability.AVAILABLE
      : MediaAvailability.UNAVAILABLE,
  };
}

export function source(): YoutubePlaylistOutput {
  return {
    sourceExternalId: 'PLtest',
    sourceUrl: 'https://www.youtube.com/playlist?list=PLtest',
    title: 'Source',
    description: null,
    thumbnailUrl: null,
    totalCount: 3,
    items: [video('video01'), video('video02'), video('video03', false)],
    fetchedCount: 3,
    availableCount: 2,
    unavailableCount: 1,
    skippedCount: 0,
  };
}

export function importFixture() {
  const mocks = repositoryMocks();
  const { provider, playlists, items, media, history, transaction } = mocks;
  const writer = new PlaylistImportWriter(media, items);
  const importer = new YoutubePlaylistImportService(
    provider,
    playlists,
    history,
    transaction,
    writer,
  );
  const sync = new YoutubePlaylistSyncService(
    provider,
    playlists,
    items,
    history,
    transaction,
    writer,
  );
  const playlist = importedPlaylist();
  playlists.findByIdForUser.mockResolvedValue(playlist);
  return { ...mocks, importer, sync, playlist };
}

function repositoryMocks() {
  const provider = { preview: vi.fn().mockResolvedValue(source()) };
  const playlists = {
    save: vi.fn(),
    findByIdForUser: vi.fn(),
    findAllForUser: vi.fn(),
    deleteForUser: vi.fn(),
  };
  const items = {
    findDetailed: vi.fn().mockResolvedValue([]),
    append: vi.fn(),
    findById: vi.fn(),
    remove: vi.fn(),
    reorder: vi.fn(),
    copy: vi.fn(),
  };
  const media = { save: vi.fn(async (value) => value) };
  const history = { read: vi.fn().mockResolvedValue([]), remember: vi.fn() };
  const transaction = { execute: vi.fn(async (callback) => callback()) };
  return { provider, playlists, items, media, history, transaction };
}

function importedPlaylist() {
  const base = createPlaylist('owner', { name: 'My renamed playlist' });
  const playlist = Playlist.create({
    ...base,
    sourceType: PlaylistSourceType.YOUTUBE,
    sourceUrl: source().sourceUrl,
    sourceExternalId: 'PLtest',
    lastSyncedAt: null,
    createdAt: base.createdAt,
    updatedAt: base.updatedAt,
  });
  return playlist;
}
