import { Playlist } from '../../../domain/entities/playlist.entity.js';
import { PlaylistOrmEntity } from '../entities/playlist.orm-entity.js';

export function toPlaylistDomain(entity: PlaylistOrmEntity): Playlist {
  return Playlist.create({ ...entity });
}

export function toPlaylistPersistence(value: Playlist): PlaylistOrmEntity {
  return Object.assign(new PlaylistOrmEntity(), {
    id: value.id,
    userId: value.userId,
    name: value.name,
    description: value.description,
    thumbnailUrl: value.thumbnailUrl,
    sourceType: value.sourceType,
    sourceExternalId: value.sourceExternalId,
    sourceUrl: value.sourceUrl,
    lastSyncedAt: value.lastSyncedAt,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  });
}
