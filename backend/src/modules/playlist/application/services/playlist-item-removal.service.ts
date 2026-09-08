import { Inject, Injectable } from '@nestjs/common';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import {
  UNIT_OF_WORK,
  type UnitOfWork,
} from '../../../../infrastructure/database/transaction/unit-of-work.interface.js';
import { PlaylistSourceType } from '../../domain/enums/playlist-source-type.enum.js';
import {
  PLAYLIST_REPOSITORY,
  type PlaylistRepositoryInterface,
} from '../interfaces/playlist.repository.interface.js';
import {
  PLAYLIST_ITEM_REPOSITORY,
  type PlaylistItemRepositoryInterface,
} from '../interfaces/playlist-item.repository.interface.js';
import {
  PLAYLIST_SOURCE_HISTORY,
  type PlaylistSourceHistoryRepositoryInterface,
} from '../interfaces/playlist-source-history.repository.interface.js';

@Injectable()
export class PlaylistItemRemovalService {
  constructor(
    @Inject(PLAYLIST_REPOSITORY)
    private readonly playlists: PlaylistRepositoryInterface,
    @Inject(PLAYLIST_ITEM_REPOSITORY)
    private readonly items: PlaylistItemRepositoryInterface,
    @Inject(PLAYLIST_SOURCE_HISTORY)
    private readonly history: PlaylistSourceHistoryRepositoryInterface,
    @Inject(UNIT_OF_WORK) private readonly transaction: UnitOfWork,
  ) {}

  remove(userId: string, id: string, itemId: string) {
    return this.transaction.execute(async () => {
      const playlist = await this.playlists.findByIdForUser(id, userId);
      if (!playlist)
        throw new BusinessException({
          code: ErrorCode.PLAYLIST_NOT_FOUND,
          message: 'Playlist not found',
        });
      const current = await this.items.findDetailed(id);
      const removed = current.find((value) => value.item.id === itemId);
      if (!removed)
        throw new BusinessException({
          code: ErrorCode.PLAYLIST_ITEM_NOT_FOUND,
          message: 'Playlist item not found',
        });
      if (playlist.sourceType === PlaylistSourceType.YOUTUBE)
        await this.history.remember(id, [removed.media.externalMediaId]);
      await this.items.remove(itemId);
      const remaining = current
        .filter((value) => value.item.id !== itemId)
        .map(({ item }, position) => item.withPosition(position));
      await this.items.reorder(remaining);
      return { playlist, items: await this.items.findDetailed(id) };
    });
  }
}
