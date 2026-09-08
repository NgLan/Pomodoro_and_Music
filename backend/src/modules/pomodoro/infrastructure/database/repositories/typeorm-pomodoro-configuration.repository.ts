import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import type { PomodoroConfigurationRepositoryInterface } from '../../../application/interfaces/pomodoro-configuration.repository.interface.js';
import type { Pomodoro } from '../../../domain/entities/pomodoro.entity.js';
import { PomodoroOrmEntity } from '../entities/pomodoro.orm-entity.js';
import {
  toPomodoroDomain,
  toPomodoroPersistence,
} from '../mappers/pomodoro.mapper.js';

@Injectable()
export class TypeOrmPomodoroConfigurationRepository implements PomodoroConfigurationRepositoryInterface {
  constructor(
    @InjectRepository(PomodoroOrmEntity)
    private readonly pomodoros: Repository<PomodoroOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async save(value: Pomodoro): Promise<void> {
    await this.pomodoros.save(toPomodoroPersistence(value));
  }

  async findByIdForUser(id: string, userId: string): Promise<Pomodoro | null> {
    const entity = await this.pomodoros.findOne({
      where: { id, userId, deletedAt: IsNull() },
    });
    return entity ? toPomodoroDomain(entity) : null;
  }

  async findAllForUser(
    userId: string,
    includeDeleted = false,
  ): Promise<Pomodoro[]> {
    const values = await this.pomodoros.find({
      where: includeDeleted ? { userId } : { userId, deletedAt: IsNull() },
      order: { updatedAt: 'DESC' },
    });
    return values.map(toPomodoroDomain);
  }

  async deleteForUser(id: string, userId: string): Promise<boolean> {
    const existing = await this.pomodoros.findOne({
      where: { id, userId, deletedAt: IsNull() },
    });
    if (!existing) return false;

    const historyRows = (await this.dataSource.query(
      'SELECT 1 FROM pomodoro_history WHERE pomodoro_id = $1 LIMIT 1',
      [id],
    )) as unknown[];

    if (historyRows.length > 0) {
      existing.deletedAt = new Date();
      await this.pomodoros.save(existing);
      return true;
    }

    const result = await this.pomodoros.delete({ id, userId });
    return result.affected === 1;
  }

  async arePlaylistsOwnedByUser(
    ids: string[],
    userId: string,
  ): Promise<boolean> {
    const rows = (await this.dataSource.query(
      'SELECT id FROM playlists WHERE user_id = $1 AND id = ANY($2::uuid[])',
      [userId, ids],
    )) as { id: string }[];
    return rows.length === ids.length;
  }
}
