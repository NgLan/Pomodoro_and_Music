import { Inject, Injectable } from '@nestjs/common';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import {
  UNIT_OF_WORK,
  type UnitOfWork,
} from '../../../../infrastructure/database/transaction/unit-of-work.interface.js';
import { reorderPlaylistItems } from '../../domain/rules/reorder-playlist-items.rule.js';
import type { AddVideoInput } from '../inputs/add-video.input.js';
import type { ReorderPlaylistItemsInput } from '../inputs/reorder-playlist-items.input.js';
import type { PlaylistItemServiceInterface } from '../interfaces/playlist-item.service.interface.js';
import {
  MEDIA_ITEM_REPOSITORY,
  type MediaItemRepositoryInterface,
} from '../interfaces/media-item.repository.interface.js';
import {
  PLAYLIST_ITEM_REPOSITORY,
  type PlaylistItemRepositoryInterface,
} from '../interfaces/playlist-item.repository.interface.js';
import {
  PLAYLIST_REPOSITORY,
  type PlaylistRepositoryInterface,
} from '../interfaces/playlist.repository.interface.js';
import {
  YOUTUBE_MEDIA_PROVIDER,
  type YoutubeMediaProviderInterface,
} from '../interfaces/youtube-media.provider.interface.js';
import type { PlaylistDetailOutput } from '../outputs/playlist-detail.output.js';
import { createMedia, createPlaylistItem } from './playlist.factory.js';

@Injectable()
export class PlaylistItemService implements PlaylistItemServiceInterface {
  constructor(
    @Inject(PLAYLIST_REPOSITORY)
    private readonly playlists: PlaylistRepositoryInterface,
    @Inject(PLAYLIST_ITEM_REPOSITORY)
    private readonly items: PlaylistItemRepositoryInterface,
    @Inject(MEDIA_ITEM_REPOSITORY)
    private readonly media: MediaItemRepositoryInterface,
    @Inject(YOUTUBE_MEDIA_PROVIDER)
    private readonly youtube: YoutubeMediaProviderInterface,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
  ) {}

  async add(
    userId: string,
    id: string,
    input: AddVideoInput,
  ): Promise<PlaylistDetailOutput> {
    const metadata = await this.youtube.resolveById(input.externalVideoId);
    return this.unitOfWork.execute(async () => {
      await this.requirePlaylist(userId, id);
      const current = await this.items.findDetailed(id);
      const media = await this.media.save(createMedia(metadata));
      await this.items.append(createPlaylistItem(id, media.id, current.length));
      return this.detail(userId, id);
    });
  }

  remove(
    userId: string,
    id: string,
    itemId: string,
  ): Promise<PlaylistDetailOutput> {
    return this.unitOfWork.execute(async () => {
      await this.requirePlaylist(userId, id);
      if (!(await this.items.findById(id, itemId))) this.itemNotFound();
      await this.items.remove(itemId);
      const remaining = (await this.items.findDetailed(id)).map(
        ({ item }, position) => item.withPosition(position),
      );
      await this.items.reorder(remaining);
      return this.detail(userId, id);
    });
  }

  reorder(
    userId: string,
    id: string,
    input: ReorderPlaylistItemsInput,
  ): Promise<PlaylistDetailOutput> {
    return this.unitOfWork.execute(async () => {
      await this.requirePlaylist(userId, id);
      const current = (await this.items.findDetailed(id)).map(
        ({ item }) => item,
      );
      await this.items.reorder(reorderPlaylistItems(current, input.itemIds));
      return this.detail(userId, id);
    });
  }

  private async detail(
    userId: string,
    id: string,
  ): Promise<PlaylistDetailOutput> {
    const playlist = await this.requirePlaylist(userId, id);
    return { playlist, items: await this.items.findDetailed(id) };
  }

  private async requirePlaylist(userId: string, id: string) {
    const playlist = await this.playlists.findByIdForUser(id, userId);
    if (!playlist)
      throw new BusinessException({
        code: ErrorCode.PLAYLIST_NOT_FOUND,
        message: 'Playlist was not found',
      });
    return playlist;
  }

  private itemNotFound(): never {
    throw new BusinessException({
      code: ErrorCode.PLAYLIST_ITEM_NOT_FOUND,
      message: 'Playlist item was not found',
    });
  }
}
