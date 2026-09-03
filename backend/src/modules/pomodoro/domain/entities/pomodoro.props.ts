export interface PomodoroDurations {
  focusDurationSeconds: number;
  shortBreakDurationSeconds: number;
  longBreakDurationSeconds: number;
  focusSessionsBeforeLongBreak: number;
}

export interface PomodoroProps extends PomodoroDurations {
  id: string;
  userId: string;
  name: string;
  focusPlaylistId: string | null;
  breakPlaylistId: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PomodoroDurationUpdate = Partial<PomodoroDurations>;
