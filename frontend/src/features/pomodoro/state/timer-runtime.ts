import type {
  CreatePomodoroHistoryRequestDto,
  PomodoroConfigurationResponseDto,
  PomodoroPhaseType,
} from "@/api";
import { getNextPhase, getPhaseDuration } from "./pomodoro-machine";
import type { TimerRuntime } from "../types/pomodoro-ui.types";

export function createTimerRuntime(
  configuration: PomodoroConfigurationResponseDto,
  phase: PomodoroPhaseType = "FOCUS",
  completedFocusSessions = 0,
): TimerRuntime {
  const duration = getPhaseDuration(configuration, phase);
  return {
    completedFocusSessions,
    configurationSnapshot: configuration,
    endAt: null,
    phase,
    plannedDurationSeconds: duration,
    remainingSeconds: duration,
    startedAt: null,
    status: "IDLE",
  };
}

export function createCompletedHistory(
  runtime: TimerRuntime,
  endedAt: string,
): CreatePomodoroHistoryRequestDto {
  return {
    pomodoroId: runtime.configurationSnapshot.id,
    phaseType: runtime.phase,
    plannedDurationSeconds: runtime.plannedDurationSeconds,
    actualDurationSeconds: runtime.plannedDurationSeconds,
    status: "COMPLETED",
    startedAt: runtime.startedAt ?? endedAt,
    endedAt,
  };
}

export function createStoppedHistory(
  runtime: TimerRuntime,
  remainingSeconds: number,
  endedAt: string,
): CreatePomodoroHistoryRequestDto {
  return {
    pomodoroId: runtime.configurationSnapshot.id,
    phaseType: runtime.phase,
    plannedDurationSeconds: runtime.plannedDurationSeconds,
    actualDurationSeconds: Math.max(0, runtime.plannedDurationSeconds - remainingSeconds),
    status: "ENDED_EARLY",
    startedAt: runtime.startedAt ?? endedAt,
    endedAt,
  };
}

export function advanceRuntime(
  runtime: TimerRuntime,
  configuration: PomodoroConfigurationResponseDto,
): TimerRuntime {
  const transition = getNextPhase(
    runtime.phase,
    runtime.completedFocusSessions,
    runtime.configurationSnapshot.focusSessionsBeforeLongBreak,
  );
  return createTimerRuntime(
    configuration,
    transition.nextPhase,
    transition.completedFocusSessions,
  );
}
