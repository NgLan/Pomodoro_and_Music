import { ErrorCode } from '../../../src/common/exceptions/error-code.enum.js';
import { MediaItem } from '../../../src/modules/playlist/domain/entities/media-item.entity.js';
import { Playlist } from '../../../src/modules/playlist/domain/entities/playlist.entity.js';
import { PlaylistItem } from '../../../src/modules/playlist/domain/entities/playlist-item.entity.js';
import { MediaAvailability } from '../../../src/modules/playlist/domain/enums/media-availability.enum.js';
import { MediaPlatform } from '../../../src/modules/playlist/domain/enums/media-platform.enum.js';
import { PlaylistSourceType } from '../../../src/modules/playlist/domain/enums/playlist-source-type.enum.js';
import { reorderPlaylistItems } from '../../../src/modules/playlist/domain/rules/reorder-playlist-items.rule.js';

const NOW = new Date('2026-01-01T00:00:00.000Z');

function createPlaylistItem(
  id: string,
  position: number,
  playlistId = 'playlist-1',
  mediaItemId = `media-${id}`,
) {
  return PlaylistItem.create({
    id,
    playlistId,
    mediaItemId,
    position,
    createdAt: NOW,
    updatedAt: NOW,
  });
}

function createMediaItem(
  overrides: Partial<Parameters<typeof MediaItem.create>[0]> = {},
) {
  return MediaItem.create({
    id: 'media-1',
    platform: MediaPlatform.YOUTUBE,
    externalMediaId: 'video-1',
    title: 'Focus track',
    channelName: 'Focus channel',
    thumbnailUrl: null,
    durationSeconds: null,
    sourceUrl: 'https://www.youtube.com/watch?v=video-1',
    availability: MediaAvailability.AVAILABLE,
    metadata: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

describe('Playlist domain', () => {
  it.each([
    {
      sourceType: PlaylistSourceType.MANUAL,
      sourceExternalId: null,
      sourceUrl: null,
    },
    {
      sourceType: PlaylistSourceType.YOUTUBE,
      sourceExternalId: 'youtube-playlist-1',
      sourceUrl: 'https://www.youtube.com/playlist?list=youtube-playlist-1',
    },
  ])('represents an independent $sourceType playlist', (source) => {
    const playlist = Playlist.create({
      id: 'playlist-1',
      userId: 'user-1',
      name: 'Focus',
      description: null,
      thumbnailUrl: null,
      ...source,
      lastSyncedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    });

    expect(playlist.sourceType).toBe(source.sourceType);
    expect(playlist.sourceExternalId).toBe(source.sourceExternalId);
  });
});

describe('PlaylistItem domain', () => {
  it.each([0, 1, 10])('accepts position %s', (position) => {
    expect(createPlaylistItem('item-1', position).position).toBe(position);
  });

  it('rejects a negative position', () => {
    expect(() => createPlaylistItem('item-1', -1)).toThrowError(
      expect.objectContaining({ code: ErrorCode.INVALID_PLAYLIST_POSITION }),
    );
  });

  it('allows duplicate media items in one playlist', () => {
    const items = [
      createPlaylistItem('item-1', 0, 'playlist-1', 'media-1'),
      createPlaylistItem('item-2', 1, 'playlist-1', 'media-1'),
    ];

    expect(items[0]?.mediaItemId).toBe(items[1]?.mediaItemId);
  });
});

describe('playlist reorder rule', () => {
  const items = [
    createPlaylistItem('item-1', 0),
    createPlaylistItem('item-2', 1),
    createPlaylistItem('item-3', 2),
  ];

  it('produces deterministic contiguous zero-based positions', () => {
    const first = reorderPlaylistItems(items, ['item-3', 'item-1', 'item-2']);
    const second = reorderPlaylistItems(items, ['item-3', 'item-1', 'item-2']);

    expect(first.map(({ id, position }) => ({ id, position }))).toEqual([
      { id: 'item-3', position: 0 },
      { id: 'item-1', position: 1 },
      { id: 'item-2', position: 2 },
    ]);
    expect(second.map(({ id, position }) => ({ id, position }))).toEqual(
      first.map(({ id, position }) => ({ id, position })),
    );
  });

  it.each([
    ['duplicate IDs', ['item-1', 'item-1', 'item-3']],
    ['missing IDs', ['item-1', 'item-2']],
    ['foreign IDs', ['item-1', 'item-2', 'foreign-item']],
  ] as const)('rejects %s', (_caseName, orderedIds) => {
    expect(() => reorderPlaylistItems(items, orderedIds)).toThrowError(
      expect.objectContaining({ code: ErrorCode.INVALID_PLAYLIST_ORDER }),
    );
  });

  it('rejects items from different playlists', () => {
    const mixedItems = [
      createPlaylistItem('item-1', 0, 'playlist-1'),
      createPlaylistItem('item-2', 1, 'playlist-2'),
    ];

    expect(() =>
      reorderPlaylistItems(mixedItems, ['item-1', 'item-2']),
    ).toThrowError(
      expect.objectContaining({ code: ErrorCode.INVALID_PLAYLIST_ORDER }),
    );
  });
});

describe('MediaItem domain', () => {
  it.each([undefined, null, 0, 180])(
    'accepts duration %s',
    (durationSeconds) => {
      expect(() => createMediaItem({ durationSeconds })).not.toThrow();
    },
  );

  it('rejects a negative duration', () => {
    expect(() => createMediaItem({ durationSeconds: -1 })).toThrowError(
      expect.objectContaining({ code: ErrorCode.INVALID_MEDIA_DURATION }),
    );
  });

  it.each([
    MediaAvailability.UNAVAILABLE,
    MediaAvailability.PRIVATE,
    MediaAvailability.DELETED,
    MediaAvailability.REGION_BLOCKED,
    MediaAvailability.UNKNOWN,
  ])('accepts unavailable state %s', (availability) => {
    expect(createMediaItem({ availability }).availability).toBe(availability);
  });
});
