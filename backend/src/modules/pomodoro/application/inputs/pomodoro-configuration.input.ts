export interface PomodoroConfigurationInput {
  name: string;
  focusDurationSeconds: number;
  shortBreakDurationSeconds: number;
  longBreakDurationSeconds: number;
  focusSessionsBeforeLongBreak: number;
  focusPlaylistId?: string | null;
  breakPlaylistId?: string | null;
}
