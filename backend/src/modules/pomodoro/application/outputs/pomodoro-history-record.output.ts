import type { PomodoroHistory } from '../../domain/entities/pomodoro-history.entity.js';

export interface PomodoroHistoryRecordOutput {
  history: PomodoroHistory;
  configurationName: string | null;
}
