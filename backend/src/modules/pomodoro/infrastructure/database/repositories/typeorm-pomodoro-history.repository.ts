import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import type { PomodoroHistoryFiltersInput } from '../../../application/inputs/pomodoro-history-filters.input.js';
import type { PomodoroHistoryRepositoryInterface } from '../../../application/interfaces/pomodoro-history.repository.interface.js';
import type { PomodoroHistoryRecordOutput } from '../../../application/outputs/pomodoro-history-record.output.js';
import type { PomodoroHistory } from '../../../domain/entities/pomodoro-history.entity.js';
import { PomodoroHistoryOrmEntity } from '../entities/pomodoro-history.orm-entity.js';
import { PomodoroOrmEntity } from '../entities/pomodoro.orm-entity.js';
import {
  toHistoryDomain,
  toHistoryPersistence,
} from '../mappers/pomodoro-history.mapper.js';

function applyFilters(
  query: SelectQueryBuilder<PomodoroHistoryOrmEntity>,
  filters: PomodoroHistoryFiltersInput,
): void {
  if (filters.configurationId) {
    query.andWhere('history.pomodoro_id = :configurationId', {
      configurationId: filters.configurationId,
    });
  }
  if (filters.status)
    query.andWhere('history.status = :status', { status: filters.status });
  if (filters.dateFrom)
    query.andWhere('history.started_at >= :dateFrom', {
      dateFrom: filters.dateFrom,
    });
  if (filters.dateTo)
    query.andWhere('history.started_at <= :dateTo', { dateTo: filters.dateTo });
}

@Injectable()
export class TypeOrmPomodoroHistoryRepository implements PomodoroHistoryRepositoryInterface {
  constructor(
    @InjectRepository(PomodoroHistoryOrmEntity)
    private readonly history: Repository<PomodoroHistoryOrmEntity>,
  ) {}

  async save(value: PomodoroHistory): Promise<void> {
    await this.history.save(toHistoryPersistence(value));
  }

  async list(userId: string, filters: PomodoroHistoryFiltersInput) {
    const query = this.createQuery(userId);
    applyFilters(query, filters);
    query
      .orderBy('history.started_at', 'DESC')
      .skip((filters.page - 1) * filters.pageSize)
      .take(filters.pageSize);
    const totalItems = await query.getCount();
    const { entities, raw } = await query.getRawAndEntities();
    return { items: this.mapRecords(entities, raw), totalItems };
  }

  private createQuery(userId: string) {
    return this.history
      .createQueryBuilder('history')
      .leftJoin(
        PomodoroOrmEntity,
        'pomodoro',
        'pomodoro.id = history.pomodoro_id',
      )
      .addSelect('pomodoro.name', 'configuration_name')
      .where('history.user_id = :userId', { userId });
  }

  private mapRecords(
    entities: PomodoroHistoryOrmEntity[],
    raw: Record<string, unknown>[],
  ): PomodoroHistoryRecordOutput[] {
    return entities.map((entity, index) => ({
      history: toHistoryDomain(entity),
      configurationName:
        (raw[index]?.configuration_name as string | undefined) ?? null,
    }));
  }
}
