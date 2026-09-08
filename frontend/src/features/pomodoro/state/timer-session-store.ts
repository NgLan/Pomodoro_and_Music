import type { PomodoroConfigurationResponseDto } from "@/api";
import type { TimerRuntime } from "../types/pomodoro-ui.types";
import type { TimerSessionEvents } from "../types/timer-session.types";
import { createTimerRuntime, createStoppedHistory } from "./timer-runtime";
import {
  pauseRuntime,
  resumeRuntime,
  tickTimer,
} from "./timer-session-actions";
import { getRemainingSeconds } from "./pomodoro-machine";

/** Session lifetime is owned by the provider, independently of route components. */
export class TimerSessionStore {
  private runtime: TimerRuntime | null = null;
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
    this.listeners.forEach((listener) => listener());
  };
  setEvents = (events: TimerSessionEvents) => {
    this.events = events;
  };
  configure = (configuration: PomodoroConfigurationResponseDto) => {
    if (this.runtime?.configurationSnapshot === configuration) return;
    if (this.runtime && this.runtime.status !== "IDLE") return;
    const same = this.runtime?.configurationSnapshot.id === configuration.id;
    this.set(
      createTimerRuntime(
        configuration,
        same ? this.runtime!.phase : "FOCUS",
        same ? this.runtime!.completedFocusSessions : 0,
      ),
    );
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
    this.set(
      createTimerRuntime(
        runtime.configurationSnapshot,
        runtime.phase,
        runtime.completedFocusSessions,
      ),
    );
    this.events?.stopped();
  };
}

export const createTimerSessionStore = () => new TimerSessionStore();
