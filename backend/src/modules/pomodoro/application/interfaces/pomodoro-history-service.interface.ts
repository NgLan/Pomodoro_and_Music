import type { CreatePomodoroHistoryInput } from '../inputs/create-pomodoro-history.input.js';
import type { PomodoroHistoryFiltersInput } from '../inputs/pomodoro-history-filters.input.js';
import type { PomodoroHistoryRecordOutput } from '../outputs/pomodoro-history-record.output.js';

export interface PomodoroHistoryServiceInterface {
  create(userId: string, input: CreatePomodoroHistoryInput): Promise<PomodoroHistoryRecordOutput>;
  list(
    userId: string,
    filters: PomodoroHistoryFiltersInput,
  ): Promise<{ items: PomodoroHistoryRecordOutput[]; totalItems: number }>;
}
