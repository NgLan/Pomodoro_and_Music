import { beforeEach, expect, it } from "vitest";
import {
  clearTimerSession,
  loadTimerSession,
  saveTimerSession,
} from "./timer-storage";
import type { TimerRuntime } from "../types/pomodoro-ui.types";

const mockRuntime: TimerRuntime = {
  completedFocusSessions: 1,
  configurationSnapshot: {
    id: "cfg-1",
    name: "Focus",
    focusDurationSeconds: 1500,
    shortBreakDurationSeconds: 300,
    longBreakDurationSeconds: 900,
    focusSessionsBeforeLongBreak: 4,
    focusPlaylistId: null,
    breakPlaylistId: null,
    isDefault: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  endAt: Date.now() + 60000,
  phase: "FOCUS",
  plannedDurationSeconds: 1500,
  remainingSeconds: 850,
  startedAt: "2026-01-01T00:00:00.000Z",
  status: "RUNNING",
};

beforeEach(() => {
  clearTimerSession();
});

it("saves and loads timer session in paused state when was running", () => {
  saveTimerSession(mockRuntime);
  const loaded = loadTimerSession();
  expect(loaded).not.toBeNull();
  expect(loaded?.remainingSeconds).toBe(850);
  expect(loaded?.status).toBe("PAUSED");
  expect(loaded?.endAt).toBeNull();
});

it("clears timer session from storage", () => {
  saveTimerSession(mockRuntime);
  clearTimerSession();
  expect(loadTimerSession()).toBeNull();
});
