import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TransactionContext } from '../../../../../infrastructure/database/transaction/transaction-context.js';
import type { PlaylistItemRepositoryInterface } from '../../../application/interfaces/playlist-item.repository.interface.js';
import type { PlaylistItemDetailOutput } from '../../../application/outputs/playlist-item-detail.output.js';
import type { PlaylistItem } from '../../../domain/entities/playlist-item.entity.js';
import { MediaItemOrmEntity } from '../entities/media-item.orm-entity.js';
import { PlaylistItemOrmEntity } from '../entities/playlist-item.orm-entity.js';
import { toMediaItemDomain } from '../mappers/media-item.mapper.js';
import {
  toPlaylistItemDomain,
  toPlaylistItemPersistence,
} from '../mappers/playlist-item.mapper.js';

@Injectable()
export class TypeOrmPlaylistItemRepository implements PlaylistItemRepositoryInterface {
  constructor(
    @InjectRepository(PlaylistItemOrmEntity)
    private readonly playlistItems: Repository<PlaylistItemOrmEntity>,
    private readonly transactionContext: TransactionContext,
  ) {}

  async findDetailed(playlistId: string): Promise<PlaylistItemDetailOutput[]> {
    const items = await this.repository().find({
      where: { playlistId },
      order: { position: 'ASC' },
    });
    if (!items.length) return [];
    const media = await this.mediaRepository().findBy({
      id: In(items.map((item) => item.mediaItemId)),
    });
    const mediaById = new Map(media.map((value) => [value.id, value]));
    return items.map((item) => ({
      item: toPlaylistItemDomain(item),
      media: toMediaItemDomain(mediaById.get(item.mediaItemId)!),
    }));
  }

  append(item: PlaylistItem): Promise<void> {
    return this.repository()
      .save(toPlaylistItemPersistence(item))
      .then(() => undefined);
  }

  async findById(
    playlistId: string,
    itemId: string,
  ): Promise<PlaylistItem | null> {
    const value = await this.repository().findOne({
      where: { id: itemId, playlistId },
    });
    return value ? toPlaylistItemDomain(value) : null;
  }

  async remove(itemId: string): Promise<void> {
    await this.repository().delete({ id: itemId });
  }

  async reorder(items: readonly PlaylistItem[]): Promise<void> {
    if (!items.length) return;
    const repository = this.repository();
    const playlistId = items[0]!.playlistId;
    await repository.increment({ playlistId }, 'position', items.length);
    await repository.save(items.map(toPlaylistItemPersistence));
  }

  async copy(
    sourcePlaylistId: string,
    targetPlaylistId: string,
    now: Date,
  ): Promise<void> {
    const source = await this.repository().find({
      where: { playlistId: sourcePlaylistId },
      order: { position: 'ASC' },
    });
    const copies = source.map((item) =>
      Object.assign(new PlaylistItemOrmEntity(), {
        ...item,
        id: randomUUID(),
        playlistId: targetPlaylistId,
        createdAt: now,
        updatedAt: now,
      }),
    );
    if (copies.length) await this.repository().save(copies);
  }

  private repository(): Repository<PlaylistItemOrmEntity> {
    return (
      this.transactionContext
        .getEntityManager()
        ?.getRepository(PlaylistItemOrmEntity) ?? this.playlistItems
    );
  }

  private mediaRepository(): Repository<MediaItemOrmEntity> {
    return (
      this.transactionContext
        .getEntityManager()
        ?.getRepository(MediaItemOrmEntity) ??
      this.playlistItems.manager.getRepository(MediaItemOrmEntity)
    );
  }
}
