import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { TransactionContext } from '../../../../../infrastructure/database/transaction/transaction-context.js';
import type { PlaylistRepositoryInterface } from '../../../application/interfaces/playlist.repository.interface.js';
import type { PlaylistSummaryOutput } from '../../../application/outputs/playlist-summary.output.js';
import type { Playlist } from '../../../domain/entities/playlist.entity.js';
import { PlaylistOrmEntity } from '../entities/playlist.orm-entity.js';
import {
  toPlaylistDomain,
  toPlaylistPersistence,
} from '../mappers/playlist.mapper.js';

@Injectable()
export class TypeOrmPlaylistRepository implements PlaylistRepositoryInterface {
  constructor(
    @InjectRepository(PlaylistOrmEntity)
    private readonly playlists: Repository<PlaylistOrmEntity>,
    private readonly transactionContext: TransactionContext,
  ) {}

  save(playlist: Playlist): Promise<void> {
    return this.repository()
      .save(toPlaylistPersistence(playlist))
      .then(() => undefined);
  }

  async findByIdForUser(id: string, userId: string): Promise<Playlist | null> {
    const entity = await this.repository().findOne({ where: { id, userId } });
    return entity ? toPlaylistDomain(entity) : null;
  }

  async findAllForUser(
    userId: string,
    search?: string,
  ): Promise<PlaylistSummaryOutput[]> {
    const query = this.summaryQuery(userId, search);
    const { entities, raw } = await query.getRawAndEntities();
    return entities.map((entity, index) => ({
      playlist: toPlaylistDomain(entity),
      itemCount: Number(raw[index]?.item_count ?? 0),
      totalDurationSeconds:
        raw[index]?.total_duration === null
          ? null
          : Number(raw[index]?.total_duration),
    }));
  }

  async deleteForUser(id: string, userId: string): Promise<boolean> {
    const result = await this.repository().delete({ id, userId });
    return result.affected === 1;
  }

  private summaryQuery(userId: string, search?: string) {
    const query = this.repository()
      .createQueryBuilder('playlist')
      .leftJoin('playlist_items', 'item', 'item.playlist_id = playlist.id')
      .leftJoin('media_items', 'media', 'media.id = item.media_item_id')
      .addSelect('COUNT(item.id)', 'item_count')
      .addSelect('SUM(media.duration_seconds)', 'total_duration')
      .where('playlist.user_id = :userId', { userId })
      .groupBy('playlist.id')
      .orderBy('playlist.updated_at', 'DESC');
    if (search?.trim()) this.applySearch(query, search.trim());
    return query;
  }

  private applySearch(
    query: ReturnType<TypeOrmPlaylistRepository['summaryQuery']>,
    search: string,
  ): void {
    query.andWhere(
      new Brackets((where) =>
        where
          .where('playlist.name ILIKE :search', { search: `%${search}%` })
          .orWhere('playlist.description ILIKE :search', {
            search: `%${search}%`,
          }),
      ),
    );
  }

  private repository(): Repository<PlaylistOrmEntity> {
    return (
      this.transactionContext
        .getEntityManager()
        ?.getRepository(PlaylistOrmEntity) ?? this.playlists
    );
  }
}
