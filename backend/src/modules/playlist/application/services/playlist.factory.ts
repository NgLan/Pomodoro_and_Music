import { randomUUID } from 'node:crypto';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import { MediaItem } from '../../domain/entities/media-item.entity.js';
import { Playlist } from '../../domain/entities/playlist.entity.js';
import { PlaylistItem } from '../../domain/entities/playlist-item.entity.js';
import { MediaPlatform } from '../../domain/enums/media-platform.enum.js';
import { PlaylistSourceType } from '../../domain/enums/playlist-source-type.enum.js';
import type { PlaylistMetadataInput } from '../inputs/playlist-metadata.input.js';
import type { MediaMetadataOutput } from '../outputs/media-metadata.output.js';

export function createPlaylist(
  userId: string,
  input: PlaylistMetadataInput,
  current?: Playlist,
): Playlist {
  const name = input.name.trim();
  if (!name)
    throw new BusinessException({
      code: ErrorCode.INVALID_INPUT,
      message: 'Playlist name cannot be blank',
    });
  const now = new Date();
  return Playlist.create({
    id: current?.id ?? randomUUID(),
    userId,
    name,
    description: normalizeOptional(input.description),
    thumbnailUrl: normalizeOptional(input.thumbnailUrl),
    sourceType: current?.sourceType ?? PlaylistSourceType.MANUAL,
    sourceExternalId: current?.sourceExternalId ?? null,
    sourceUrl: current?.sourceUrl ?? null,
    lastSyncedAt: current?.lastSyncedAt ?? null,
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
  });
}

export function duplicatePlaylist(source: Playlist): Playlist {
  return createPlaylist(source.userId, {
    name: `${source.name} - Copy`,
    description: source.description,
    thumbnailUrl: source.thumbnailUrl,
  });
}

export function createMedia(metadata: MediaMetadataOutput): MediaItem {
  const now = new Date();
  return MediaItem.create({
    id: randomUUID(),
    platform: MediaPlatform.YOUTUBE,
    ...metadata,
    createdAt: now,
    updatedAt: now,
  });
}

export function createPlaylistItem(
  playlistId: string,
  mediaItemId: string,
  position: number,
): PlaylistItem {
  const now = new Date();
  return PlaylistItem.create({
    id: randomUUID(),
    playlistId,
    mediaItemId,
    position,
    createdAt: now,
    updatedAt: now,
  });
}

function normalizeOptional(value?: string | null): string | null {
  return value?.trim() || null;
}
