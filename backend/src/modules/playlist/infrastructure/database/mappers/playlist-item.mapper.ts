import { PlaylistItem } from '../../../domain/entities/playlist-item.entity.js';
import { PlaylistItemOrmEntity } from '../entities/playlist-item.orm-entity.js';

export function toPlaylistItemDomain(
  entity: PlaylistItemOrmEntity,
): PlaylistItem {
  return PlaylistItem.create({ ...entity });
}

export function toPlaylistItemPersistence(
  value: PlaylistItem,
): PlaylistItemOrmEntity {
  return Object.assign(new PlaylistItemOrmEntity(), {
    id: value.id,
    playlistId: value.playlistId,
    mediaItemId: value.mediaItemId,
    position: value.position,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  });
}
