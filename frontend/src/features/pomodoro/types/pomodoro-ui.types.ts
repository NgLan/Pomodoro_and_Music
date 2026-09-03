import type {
  PomodoroConfigurationResponseDto,
  PomodoroPhaseType,
} from "@/api";

export type WorkspaceTab = "timer" | "configurations" | "history";
export type TimerStatus = "IDLE" | "RUNNING" | "PAUSED";

export interface TimerRuntime {
  completedFocusSessions: number;
  configurationSnapshot: PomodoroConfigurationResponseDto;
  endAt: number | null;
  phase: PomodoroPhaseType;
  plannedDurationSeconds: number;
  remainingSeconds: number;
  startedAt: string | null;
  status: TimerStatus;
}

export interface ConfigurationFormValues {
  name: string;
  focusDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  focusSessionsBeforeLongBreak: number;
}
