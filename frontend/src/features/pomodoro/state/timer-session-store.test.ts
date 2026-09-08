import { beforeEach, expect, it, vi } from "vitest";
import { configurationFixture } from "@/features/music-player/state/player.fixture";
import { clearTimerSession } from "../utils/timer-storage";
import { createTimerSessionStore } from "./timer-session-store";

beforeEach(() => {
  clearTimerSession();
  vi.useRealTimers();
});

it("advances to next phase when ending a focus phase early", () => {
  const store = createTimerSessionStore();
  const record = vi.fn();
  store.setEvents({ record, completed: vi.fn(), stopped: vi.fn(), music: vi.fn() });
  store.configure(configurationFixture);

  store.toggle(); // starts running
  expect(store.getSnapshot()?.phase).toBe("FOCUS");

  store.stop(); // ends early
  expect(record).toHaveBeenCalledWith(
    expect.objectContaining({
      phaseType: "FOCUS",
      status: "ENDED_EARLY",
    }),
  );

  const snapshot = store.getSnapshot();
  expect(snapshot?.phase).toBe("SHORT_BREAK");
  expect(snapshot?.completedFocusSessions).toBe(1);
  expect(snapshot?.status).toBe("RUNNING");
});

it("advances from break phase to next focus round when ending early and automatically runs", () => {
  const store = createTimerSessionStore();
  store.setEvents({ record: vi.fn(), completed: vi.fn(), stopped: vi.fn(), music: vi.fn() });
  store.configure(configurationFixture);

  store.toggle();
  store.stop(); // Focus -> Short Break (auto-starts RUNNING)
  expect(store.getSnapshot()?.phase).toBe("SHORT_BREAK");
  expect(store.getSnapshot()?.status).toBe("RUNNING");

  store.stop(); // end break early -> Focus (auto-starts RUNNING)
  expect(store.getSnapshot()?.phase).toBe("FOCUS");
  expect(store.getSnapshot()?.completedFocusSessions).toBe(1);
  expect(store.getSnapshot()?.status).toBe("RUNNING");
});

it("resets entire session cycle back to round 1 (Focus) with 0 completed sessions", () => {
  const store = createTimerSessionStore();
  store.setEvents({ record: vi.fn(), completed: vi.fn(), stopped: vi.fn(), music: vi.fn() });
  store.configure(configurationFixture);

  store.toggle();
  store.stop(); // advanced to Short Break
  expect(store.getSnapshot()?.phase).toBe("SHORT_BREAK");

  store.reset(); // user resets all sessions
  const snapshot = store.getSnapshot();
  expect(snapshot?.phase).toBe("FOCUS");
  expect(snapshot?.completedFocusSessions).toBe(0);
  expect(snapshot?.status).toBe("IDLE");
  expect(snapshot?.remainingSeconds).toBe(configurationFixture.focusDurationSeconds);
});
