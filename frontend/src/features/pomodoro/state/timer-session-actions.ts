import type { TimerRuntime } from "../types/pomodoro-ui.types";
import type { TimerSessionEvents } from "../types/timer-session.types";
import { getRemainingSeconds } from "./pomodoro-machine";
import { advanceRuntime, createCompletedHistory } from "./timer-runtime";

export function pauseRuntime(runtime: TimerRuntime): TimerRuntime {
  return {
    ...runtime,
    status: "PAUSED",
    endAt: null,
    remainingSeconds: getRemainingSeconds(runtime.endAt!, Date.now()),
  };
}

export function resumeRuntime(runtime: TimerRuntime): TimerRuntime {
  const now = Date.now();
  return {
    ...runtime,
    status: "RUNNING",
    endAt: now + runtime.remainingSeconds * 1000,
    startedAt: runtime.startedAt ?? new Date(now).toISOString(),
  };
}

export function tickTimer(
  runtime: TimerRuntime,
  set: (next: TimerRuntime) => void,
  events: TimerSessionEvents | null,
) {
  if (runtime.status !== "RUNNING" || runtime.endAt === null) return;
  const remainingSeconds = getRemainingSeconds(runtime.endAt, Date.now());
  if (remainingSeconds > 0) {
    if (remainingSeconds !== runtime.remainingSeconds)
      set({ ...runtime, remainingSeconds });
    return;
  }
  const next = advanceRuntime(runtime, runtime.configurationSnapshot);
  set(next);
  events?.record(
    createCompletedHistory(runtime, new Date(runtime.endAt).toISOString()),
  );
  events?.music(next);
  events?.completed();
}
