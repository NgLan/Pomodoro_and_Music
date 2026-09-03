import type { PomodoroHistoryStatus } from '../../domain/enums/pomodoro-history-status.enum.js';
import type { PomodoroPhaseType } from '../../domain/enums/pomodoro-phase-type.enum.js';

export interface CreatePomodoroHistoryInput {
  pomodoroId?: string | null;
  phaseType: PomodoroPhaseType;
  plannedDurationSeconds: number;
  actualDurationSeconds: number;
  startedAt: Date;
  endedAt: Date;
  status: PomodoroHistoryStatus;
}
