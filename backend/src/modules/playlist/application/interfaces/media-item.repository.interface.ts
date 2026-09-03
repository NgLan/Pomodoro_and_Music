import type { MediaItem } from '../../domain/entities/media-item.entity.js';

export const MEDIA_ITEM_REPOSITORY = Symbol('MEDIA_ITEM_REPOSITORY');

export interface MediaItemRepositoryInterface {
  save(media: MediaItem): Promise<MediaItem>;
}
