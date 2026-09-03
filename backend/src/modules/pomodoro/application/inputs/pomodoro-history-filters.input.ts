import type { PomodoroHistoryStatus } from '../../domain/enums/pomodoro-history-status.enum.js';

export interface PomodoroHistoryFiltersInput {
  configurationId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page: number;
  pageSize: number;
  status?: PomodoroHistoryStatus;
}
