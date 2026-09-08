import type { TimerRuntime } from "../types/pomodoro-ui.types";

const TIMER_STORAGE_KEY = "cappucino_pomodoro_runtime";

export function saveTimerSession(runtime: TimerRuntime | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!runtime) {
      window.localStorage.removeItem(TIMER_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(runtime));
  } catch {
    // Ignore quota or private browsing errors
  }
}

export function loadTimerSession(): TimerRuntime | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TIMER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TimerRuntime;
    if (!parsed || !parsed.configurationSnapshot || !parsed.phase) return null;
    return normalizeLoadedRuntime(parsed);
  } catch {
    return null;
  }
}

function normalizeLoadedRuntime(parsed: TimerRuntime): TimerRuntime {
  if (parsed.status === "RUNNING") {
    return {
      ...parsed,
      status: "PAUSED",
      endAt: null,
    };
  }
  return parsed;
}

export function clearTimerSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TIMER_STORAGE_KEY);
  } catch {
    // Ignore error
  }
}
