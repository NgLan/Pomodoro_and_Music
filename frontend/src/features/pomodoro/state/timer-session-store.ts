import type { PomodoroConfigurationResponseDto } from "@/api";
import type { TimerRuntime } from "../types/pomodoro-ui.types";
import type { TimerSessionEvents } from "../types/timer-session.types";
import {
  createTimerRuntime,
  createStoppedHistory,
  advanceRuntime,
} from "./timer-runtime";
import {
  pauseRuntime,
  resumeRuntime,
  tickTimer,
} from "./timer-session-actions";
import { getRemainingSeconds } from "./pomodoro-machine";
import { loadTimerSession, saveTimerSession } from "../utils/timer-storage";

/** Session lifetime is owned by the provider, independently of route components. */
export class TimerSessionStore {
  private runtime: TimerRuntime | null = loadTimerSession();
  private events: TimerSessionEvents | null = null;
  private listeners = new Set<() => void>();
  getSnapshot = () => this.runtime;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private set = (next: TimerRuntime) => {
    this.runtime = next;
    saveTimerSession(next);
    this.listeners.forEach((listener) => listener());
  };
  setEvents = (events: TimerSessionEvents) => {
    this.events = events;
  };
  configure = (configuration: PomodoroConfigurationResponseDto) => {
    if (this.runtime?.configurationSnapshot === configuration) return;
    const same = this.runtime?.configurationSnapshot.id === configuration.id;
    if (this.runtime && this.runtime.status !== "IDLE") {
      if (same) {
        this.set({ ...this.runtime, configurationSnapshot: configuration });
        this.events?.music(this.runtime);
      }
      return;
    }
    const next = createTimerRuntime(
      configuration,
      same ? this.runtime!.phase : "FOCUS",
      same ? this.runtime!.completedFocusSessions : 0,
    );
    this.set(next);
    this.events?.music(next);
  };
  toggle = () => {
    const runtime = this.runtime;
    if (!runtime) return;
    if (runtime.status === "RUNNING") this.set(pauseRuntime(runtime));
    else {
      this.set(resumeRuntime(runtime));
      if (runtime.status === "IDLE") this.events?.music(this.runtime!);
    }
  };
  tick = () => {
    if (this.runtime) tickTimer(this.runtime, this.set, this.events);
  };
  stop = () => {
    const runtime = this.runtime;
    if (!runtime || runtime.status === "IDLE") return;
    const remaining = runtime.endAt
      ? getRemainingSeconds(runtime.endAt, Date.now())
      : runtime.remainingSeconds;
    this.events?.record(
      createStoppedHistory(runtime, remaining, new Date().toISOString()),
    );
    const next = resumeRuntime(
      advanceRuntime(runtime, runtime.configurationSnapshot),
    );
    this.set(next);
    this.events?.music(next);
    this.events?.stopped();
  };
  reset = () => {
    const runtime = this.runtime;
    if (!runtime) return;
    const next = createTimerRuntime(runtime.configurationSnapshot, "FOCUS", 0);
    this.set(next);
    this.events?.music(next);
    this.events?.stopped();
  };
}

export const createTimerSessionStore = () => new TimerSessionStore();
