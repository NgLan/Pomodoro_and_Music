import { Inject, Injectable } from '@nestjs/common';
import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import type { CreatePomodoroHistoryInput } from '../inputs/create-pomodoro-history.input.js';
import type { PomodoroHistoryFiltersInput } from '../inputs/pomodoro-history-filters.input.js';
import {
  POMODORO_HISTORY_REPOSITORY,
  type PomodoroHistoryRepositoryInterface,
} from '../interfaces/pomodoro-history.repository.interface.js';
import type { PomodoroHistoryServiceInterface } from '../interfaces/pomodoro-history-service.interface.js';
import type { PomodoroHistoryRecordOutput } from '../outputs/pomodoro-history-record.output.js';
import { createHistory } from './pomodoro.factory.js';
import { PomodoroConfigurationService } from './pomodoro-configuration.service.js';

@Injectable()
export class PomodoroHistoryService implements PomodoroHistoryServiceInterface {
  constructor(
    @Inject(POMODORO_HISTORY_REPOSITORY)
    private readonly repository: PomodoroHistoryRepositoryInterface,
    private readonly configurations: PomodoroConfigurationService,
  ) {}

  async create(
    userId: string,
    input: CreatePomodoroHistoryInput,
  ): Promise<PomodoroHistoryRecordOutput> {
    const configurationName = await this.getConfigurationName(
      userId,
      input.pomodoroId,
    );
    this.validateDuration(input);
    const history = createHistory(userId, input);
    await this.repository.save(history);
    return { history, configurationName };
  }

  list(userId: string, filters: PomodoroHistoryFiltersInput) {
    return this.repository.list(userId, filters);
  }

  private async getConfigurationName(
    userId: string,
    id?: string | null,
  ): Promise<string | null> {
    return id ? (await this.configurations.get(userId, id)).name : null;
  }

  private validateDuration(input: CreatePomodoroHistoryInput): void {
    const elapsed = Math.max(
      0,
      Math.ceil((input.endedAt.getTime() - input.startedAt.getTime()) / 1000),
    );
    if (input.actualDurationSeconds > elapsed + 1) {
      throw new BusinessException({
        code: ErrorCode.INVALID_POMODORO_HISTORY_DURATION,
        message: 'Actual duration cannot exceed elapsed wall time',
      });
    }
  }
}
