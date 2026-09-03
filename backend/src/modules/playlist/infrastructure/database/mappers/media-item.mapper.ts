import { MediaItem } from '../../../domain/entities/media-item.entity.js';
import { MediaItemOrmEntity } from '../entities/media-item.orm-entity.js';

export function toMediaItemDomain(entity: MediaItemOrmEntity): MediaItem {
  return MediaItem.create({ ...entity });
}

export function toMediaItemPersistence(value: MediaItem): MediaItemOrmEntity {
  return Object.assign(new MediaItemOrmEntity(), {
    id: value.id,
    platform: value.platform,
    externalMediaId: value.externalMediaId,
    title: value.title,
    channelName: value.channelName,
    thumbnailUrl: value.thumbnailUrl,
    durationSeconds: value.durationSeconds,
    sourceUrl: value.sourceUrl,
    availability: value.availability,
    metadata: value.metadata,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  });
}
