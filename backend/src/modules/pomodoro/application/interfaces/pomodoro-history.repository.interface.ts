import type { PomodoroHistory } from '../../domain/entities/pomodoro-history.entity.js';
import type { PomodoroHistoryFiltersInput } from '../inputs/pomodoro-history-filters.input.js';
import type { PomodoroHistoryRecordOutput } from '../outputs/pomodoro-history-record.output.js';

export const POMODORO_HISTORY_REPOSITORY = Symbol(
  'POMODORO_HISTORY_REPOSITORY',
);

export interface PomodoroHistoryRepositoryInterface {
  save(value: PomodoroHistory): Promise<void>;
  list(
    userId: string,
    filters: PomodoroHistoryFiltersInput,
  ): Promise<{ items: PomodoroHistoryRecordOutput[]; totalItems: number }>;
}
