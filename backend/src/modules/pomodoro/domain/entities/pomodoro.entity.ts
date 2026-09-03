import type {
  PomodoroDurations,
  PomodoroDurationUpdate,
  PomodoroProps,
} from './pomodoro.props.js';
import { validatePomodoroDurations } from '../rules/validate-pomodoro-durations.rule.js';

export class Pomodoro {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  private focusDurationSecondsValue: number;
  private shortBreakDurationSecondsValue: number;
  private longBreakDurationSecondsValue: number;
  private focusSessionsBeforeLongBreakValue: number;
  readonly focusPlaylistId: string | null;
  readonly breakPlaylistId: string | null;
  readonly isDefault: boolean;
  private readonly createdAtValue: Date;
  private readonly updatedAtValue: Date;

  private constructor(props: PomodoroProps) {
    validatePomodoroDurations(props);
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.focusDurationSecondsValue = props.focusDurationSeconds;
    this.shortBreakDurationSecondsValue = props.shortBreakDurationSeconds;
    this.longBreakDurationSecondsValue = props.longBreakDurationSeconds;
    this.focusSessionsBeforeLongBreakValue = props.focusSessionsBeforeLongBreak;
    this.focusPlaylistId = props.focusPlaylistId;
    this.breakPlaylistId = props.breakPlaylistId;
    this.isDefault = props.isDefault;
    this.createdAtValue = new Date(props.createdAt);
    this.updatedAtValue = new Date(props.updatedAt);
  }

  static create(props: PomodoroProps): Pomodoro {
    return new Pomodoro(props);
  }

  get focusDurationSeconds(): number {
    return this.focusDurationSecondsValue;
  }

  get shortBreakDurationSeconds(): number {
    return this.shortBreakDurationSecondsValue;
  }

  get longBreakDurationSeconds(): number {
    return this.longBreakDurationSecondsValue;
  }

  get focusSessionsBeforeLongBreak(): number {
    return this.focusSessionsBeforeLongBreakValue;
  }

  get createdAt(): Date {
    return new Date(this.createdAtValue);
  }

  get updatedAt(): Date {
    return new Date(this.updatedAtValue);
  }

  updateDurations(update: PomodoroDurationUpdate): void {
    const candidate: PomodoroDurations = {
      focusDurationSeconds:
        update.focusDurationSeconds ?? this.focusDurationSecondsValue,
      shortBreakDurationSeconds:
        update.shortBreakDurationSeconds ?? this.shortBreakDurationSecondsValue,
      longBreakDurationSeconds:
        update.longBreakDurationSeconds ?? this.longBreakDurationSecondsValue,
      focusSessionsBeforeLongBreak:
        update.focusSessionsBeforeLongBreak ??
        this.focusSessionsBeforeLongBreakValue,
    };

    validatePomodoroDurations(candidate);
    this.focusDurationSecondsValue = candidate.focusDurationSeconds;
    this.shortBreakDurationSecondsValue = candidate.shortBreakDurationSeconds;
    this.longBreakDurationSecondsValue = candidate.longBreakDurationSeconds;
    this.focusSessionsBeforeLongBreakValue =
      candidate.focusSessionsBeforeLongBreak;
  }
}
