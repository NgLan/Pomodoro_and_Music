import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import { PlaylistItem } from '../entities/playlist-item.entity.js';

function invalidOrder(): never {
  throw new BusinessException({
    code: ErrorCode.INVALID_PLAYLIST_ORDER,
    message: 'Playlist order must contain every item exactly once',
  });
}

export function reorderPlaylistItems(
  items: readonly PlaylistItem[],
  orderedItemIds: readonly string[],
): PlaylistItem[] {
  if (items.length !== orderedItemIds.length) invalidOrder();
  const itemsById = new Map(items.map((item) => [item.id, item]));
  validatePlaylistItems(items, itemsById);
  const seenIds = new Set<string>();
  return orderedItemIds.map((id, position) =>
    reorderItem(id, position, itemsById, seenIds));
}

function validatePlaylistItems(
  items: readonly PlaylistItem[],
  itemsById: ReadonlyMap<string, PlaylistItem>,
): void {
  if (itemsById.size !== items.length) invalidOrder();
  const playlistId = items[0]?.playlistId;
  if (items.some((item) => item.playlistId !== playlistId)) invalidOrder();
}

function reorderItem(
  itemId: string,
  position: number,
  itemsById: ReadonlyMap<string, PlaylistItem>,
  seenIds: Set<string>,
): PlaylistItem {
  if (seenIds.has(itemId)) invalidOrder();
  seenIds.add(itemId);
  const item = itemsById.get(itemId);
  if (!item) invalidOrder();
  return item.withPosition(position);
}
