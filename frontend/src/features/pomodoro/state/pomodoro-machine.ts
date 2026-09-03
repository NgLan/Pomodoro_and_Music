import type {
  PomodoroConfigurationResponseDto,
  PomodoroPhaseType,
} from "@/api";

export interface PhaseTransition {
  completedFocusSessions: number;
  nextPhase: PomodoroPhaseType;
}

export function getPhaseDuration(
  configuration: PomodoroConfigurationResponseDto,
  phase: PomodoroPhaseType,
): number {
  if (phase === "FOCUS") {
    return configuration.focusDurationSeconds;
  }
  if (phase === "SHORT_BREAK") {
    return configuration.shortBreakDurationSeconds;
  }
  return configuration.longBreakDurationSeconds;
}

export function getNextPhase(
  phase: PomodoroPhaseType,
  completedFocusSessions: number,
  focusSessionsBeforeLongBreak: number,
): PhaseTransition {
  if (phase !== "FOCUS") {
    return { completedFocusSessions, nextPhase: "FOCUS" };
  }

  const nextCompletedFocusSessions = completedFocusSessions + 1;
  const isLongBreakDue =
    nextCompletedFocusSessions % focusSessionsBeforeLongBreak === 0;

  return {
    completedFocusSessions: nextCompletedFocusSessions,
    nextPhase: isLongBreakDue ? "LONG_BREAK" : "SHORT_BREAK",
  };
}

export function getRemainingSeconds(endAt: number, now: number): number {
  return Math.max(0, Math.ceil((endAt - now) / 1_000));
}

export function getCurrentRound(
  completedFocusSessions: number,
  focusSessionsBeforeLongBreak: number,
): number {
  return (completedFocusSessions % focusSessionsBeforeLongBreak) + 1;
}
