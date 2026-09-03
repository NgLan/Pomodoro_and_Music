import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionContext } from '../../../../../infrastructure/database/transaction/transaction-context.js';
import type { MediaItemRepositoryInterface } from '../../../application/interfaces/media-item.repository.interface.js';
import type { MediaItem } from '../../../domain/entities/media-item.entity.js';
import { MediaItemOrmEntity } from '../entities/media-item.orm-entity.js';
import {
  toMediaItemDomain,
  toMediaItemPersistence,
} from '../mappers/media-item.mapper.js';

@Injectable()
export class TypeOrmMediaItemRepository implements MediaItemRepositoryInterface {
  constructor(
    @InjectRepository(MediaItemOrmEntity)
    private readonly mediaItems: Repository<MediaItemOrmEntity>,
    private readonly transactionContext: TransactionContext,
  ) {}

  async save(media: MediaItem): Promise<MediaItem> {
    const repository = this.repository();
    const current = await repository.findOne({
      where: {
        platform: media.platform,
        externalMediaId: media.externalMediaId,
      },
    });
    const persistence = toMediaItemPersistence(media);
    if (current)
      Object.assign(persistence, {
        id: current.id,
        createdAt: current.createdAt,
      });
    return toMediaItemDomain(await repository.save(persistence));
  }

  private repository(): Repository<MediaItemOrmEntity> {
    return (
      this.transactionContext
        .getEntityManager()
        ?.getRepository(MediaItemOrmEntity) ?? this.mediaItems
    );
  }
}
