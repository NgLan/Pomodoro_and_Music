import { Inject, Injectable } from '@nestjs/common';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import {
  UNIT_OF_WORK,
  type UnitOfWork,
} from '../../../../infrastructure/database/transaction/unit-of-work.interface.js';
import type { PlaylistMetadataInput } from '../inputs/playlist-metadata.input.js';
import type { PlaylistSearchInput } from '../inputs/playlist-search.input.js';
import {
  PLAYLIST_ITEM_REPOSITORY,
  type PlaylistItemRepositoryInterface,
} from '../interfaces/playlist-item.repository.interface.js';
import {
  PLAYLIST_REPOSITORY,
  type PlaylistRepositoryInterface,
} from '../interfaces/playlist.repository.interface.js';
import type { PlaylistServiceInterface } from '../interfaces/playlist.service.interface.js';
import type { PlaylistDetailOutput } from '../outputs/playlist-detail.output.js';
import type { PlaylistSummaryOutput } from '../outputs/playlist-summary.output.js';
import { createPlaylist, duplicatePlaylist } from './playlist.factory.js';

@Injectable()
export class PlaylistService implements PlaylistServiceInterface {
  constructor(
    @Inject(PLAYLIST_REPOSITORY)
    private readonly playlists: PlaylistRepositoryInterface,
    @Inject(PLAYLIST_ITEM_REPOSITORY)
    private readonly items: PlaylistItemRepositoryInterface,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
  ) {}

  async create(
    userId: string,
    input: PlaylistMetadataInput,
  ): Promise<PlaylistDetailOutput> {
    const playlist = createPlaylist(userId, input);
    await this.playlists.save(playlist);
    return { playlist, items: [] };
  }

  list(
    userId: string,
    input: PlaylistSearchInput,
  ): Promise<PlaylistSummaryOutput[]> {
    return this.playlists.findAllForUser(userId, input.search);
  }

  async get(userId: string, id: string): Promise<PlaylistDetailOutput> {
    const playlist = await this.requirePlaylist(userId, id);
    return { playlist, items: await this.items.findDetailed(id) };
  }

  async update(
    userId: string,
    id: string,
    input: PlaylistMetadataInput,
  ): Promise<PlaylistDetailOutput> {
    const current = await this.requirePlaylist(userId, id);
    await this.playlists.save(createPlaylist(userId, input, current));
    return this.get(userId, id);
  }

  async delete(userId: string, id: string): Promise<void> {
    if (!(await this.playlists.deleteForUser(id, userId))) this.notFound();
  }

  duplicate(userId: string, id: string): Promise<PlaylistDetailOutput> {
    return this.unitOfWork.execute(async () => {
      const source = await this.requirePlaylist(userId, id);
      const copy = duplicatePlaylist(source);
      await this.playlists.save(copy);
      await this.items.copy(source.id, copy.id, copy.createdAt);
      return this.get(userId, copy.id);
    });
  }

  private async requirePlaylist(userId: string, id: string) {
    const playlist = await this.playlists.findByIdForUser(id, userId);
    if (!playlist) this.notFound();
    return playlist!;
  }

  private notFound(): never {
    throw new BusinessException({
      code: ErrorCode.PLAYLIST_NOT_FOUND,
      message: 'Playlist was not found',
    });
  }
}
