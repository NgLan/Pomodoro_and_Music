import { Inject, Injectable } from '@nestjs/common';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import type { Pomodoro } from '../../domain/entities/pomodoro.entity.js';
import type { PomodoroConfigurationInput } from '../inputs/pomodoro-configuration.input.js';
import {
  POMODORO_CONFIGURATION_REPOSITORY,
  type PomodoroConfigurationRepositoryInterface,
} from '../interfaces/pomodoro-configuration.repository.interface.js';
import type { PomodoroConfigurationServiceInterface } from '../interfaces/pomodoro-configuration-service.interface.js';
import { createPomodoro } from './pomodoro.factory.js';

@Injectable()
export class PomodoroConfigurationService implements PomodoroConfigurationServiceInterface {
  constructor(
    @Inject(POMODORO_CONFIGURATION_REPOSITORY)
    private readonly repository: PomodoroConfigurationRepositoryInterface,
  ) {}

  async create(
    userId: string,
    input: PomodoroConfigurationInput,
  ): Promise<Pomodoro> {
    await this.validatePlaylists(userId, input);
    const value = createPomodoro(userId, input);
    await this.repository.save(value);
    return value;
  }

  list(userId: string): Promise<Pomodoro[]> {
    return this.repository.findAllForUser(userId);
  }

  async get(userId: string, id: string): Promise<Pomodoro> {
    const value = await this.repository.findByIdForUser(id, userId);
    if (!value) this.notFound();
    return value!;
  }

  async update(
    userId: string,
    id: string,
    input: PomodoroConfigurationInput,
  ): Promise<Pomodoro> {
    const current = await this.get(userId, id);
    await this.validatePlaylists(userId, input);
    const value = createPomodoro(userId, input, current);
    await this.repository.save(value);
    return value;
  }

  async delete(userId: string, id: string): Promise<void> {
    if (!(await this.repository.deleteForUser(id, userId))) this.notFound();
  }

  private async validatePlaylists(
    userId: string,
    input: PomodoroConfigurationInput,
  ): Promise<void> {
    const ids = [input.focusPlaylistId, input.breakPlaylistId].filter(
      (id): id is string => Boolean(id),
    );
    const uniqueIds = [...new Set(ids)];
    if (
      uniqueIds.length &&
      !(await this.repository.arePlaylistsOwnedByUser(uniqueIds, userId))
    ) {
      throw new BusinessException({
        code: ErrorCode.FORBIDDEN,
        message: 'A selected playlist does not belong to the current user',
      });
    }
  }

  private notFound(): never {
    throw new BusinessException({
      code: ErrorCode.POMODORO_NOT_FOUND,
      message: 'Pomodoro configuration was not found',
    });
  }
}
