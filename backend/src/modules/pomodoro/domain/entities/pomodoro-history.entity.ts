import {
  BusinessException,
  ErrorCode,
} from '../../../../common/exceptions/index.js';
import { PomodoroHistoryStatus } from '../enums/pomodoro-history-status.enum.js';
import { PomodoroPhaseType } from '../enums/pomodoro-phase-type.enum.js';

export interface PomodoroHistoryProps {
  id: string;
  userId: string;
  pomodoroId: string | null;
  phaseType: PomodoroPhaseType;
  status: PomodoroHistoryStatus;
  plannedDurationSeconds: number;
  actualDurationSeconds: number;
  startedAt: Date;
  endedAt: Date;
}

export class PomodoroHistory {
  readonly id: string;
  readonly userId: string;
  readonly pomodoroId: string | null;
  readonly phaseType: PomodoroPhaseType;
  readonly status: PomodoroHistoryStatus;
  readonly plannedDurationSeconds: number;
  readonly actualDurationSeconds: number;
  private readonly startedAtValue: Date;
  private readonly endedAtValue: Date;

  private constructor(props: PomodoroHistoryProps) {
    PomodoroHistory.assertValidDuration(props);
    PomodoroHistory.assertValidRange(props.startedAt, props.endedAt);
    this.id = props.id;
    this.userId = props.userId;
    this.pomodoroId = props.pomodoroId;
    this.phaseType = props.phaseType;
    this.status = props.status;
    this.plannedDurationSeconds = props.plannedDurationSeconds;
    this.actualDurationSeconds = props.actualDurationSeconds;
    this.startedAtValue = new Date(props.startedAt);
    this.endedAtValue = new Date(props.endedAt);
  }

  static create(props: PomodoroHistoryProps): PomodoroHistory {
    return new PomodoroHistory(props);
  }

  get startedAt(): Date {
    return new Date(this.startedAtValue);
  }

  get endedAt(): Date {
    return new Date(this.endedAtValue);
  }

  private static assertValidDuration(props: PomodoroHistoryProps): void {
    if (
      !Number.isFinite(props.plannedDurationSeconds) ||
      props.plannedDurationSeconds <= 0 ||
      !Number.isFinite(props.actualDurationSeconds) ||
      props.actualDurationSeconds < 0
    ) {
      throw new BusinessException({
        code: ErrorCode.INVALID_POMODORO_HISTORY_DURATION,
        message: 'Pomodoro history durations are invalid',
      });
    }
  }

  private static assertValidRange(startedAt: Date, endedAt: Date): void {
    if (
      !Number.isFinite(startedAt.getTime()) ||
      !Number.isFinite(endedAt.getTime()) ||
      endedAt.getTime() < startedAt.getTime()
    ) {
      throw new BusinessException({
        code: ErrorCode.INVALID_POMODORO_HISTORY_RANGE,
        message: 'Pomodoro history end time cannot precede its start time',
      });
    }
  }
}
