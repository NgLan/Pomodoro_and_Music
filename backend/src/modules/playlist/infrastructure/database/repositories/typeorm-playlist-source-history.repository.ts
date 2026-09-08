import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionContext } from '../../../../../infrastructure/database/transaction/transaction-context.js';
import type { PlaylistSourceHistoryRepositoryInterface } from '../../../application/interfaces/playlist-source-history.repository.interface.js';
import { PlaylistSourceHistoryOrmEntity } from '../entities/playlist-source-history.orm-entity.js';

@Injectable()
export class TypeOrmPlaylistSourceHistoryRepository implements PlaylistSourceHistoryRepositoryInterface {
  constructor(
    @InjectRepository(PlaylistSourceHistoryOrmEntity)
    private readonly history: Repository<PlaylistSourceHistoryOrmEntity>,
    private readonly context: TransactionContext,
  ) {}

  async read(playlistId: string): Promise<string[]> {
    return (await this.repository().findBy({ playlistId })).map(
      (item) => item.videoId,
    );
  }

  async remember(playlistId: string, videoIds: string[]): Promise<void> {
    if (!videoIds.length) return;
    await this.repository().upsert(
      videoIds.map((videoId) => ({ playlistId, videoId })),
      ['playlistId', 'videoId'],
    );
  }

  private repository() {
    return (
      this.context
        .getEntityManager()
        ?.getRepository(PlaylistSourceHistoryOrmEntity) ?? this.history
    );
  }
}
