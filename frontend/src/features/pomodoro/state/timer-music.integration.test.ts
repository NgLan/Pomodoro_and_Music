import { afterEach, expect, it, vi } from "vitest";
import { createPlayerStore } from "@/features/music-player/state/player-store";
import {
  configurationFixture,
  playlistFixture,
} from "@/features/music-player/state/player.fixture";
import { createTimerSessionStore } from "./timer-session-store";

afterEach(() => vi.useRealTimers());

function session(shared = false) {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  const timer = createTimerSessionStore();
  const player = createPlayerStore();
  const record = vi.fn();
  timer.setEvents({
    record,
    completed: vi.fn(),
    stopped: vi.fn(),
    music: (runtime) => {
      player.activate(
        runtime.phase === "FOCUS"
          ? runtime.configurationSnapshot.focusPlaylistId
          : runtime.configurationSnapshot.breakPlaylistId,
      );
    },
  });
  timer.configure({
    ...configurationFixture,
    breakPlaylistId: shared ? "focus" : "break",
  });
  return { timer, player, record };
}

it("starts music, switches phase once, and restores Focus cursor", () => {
  const { timer, player, record } = session();
  timer.toggle();
  expect(player.getSnapshot().playlistId).toBe("focus");
  player.reconcile(playlistFixture());
  player.select("b");
  player.update((state) => ({ ...state, position: 42 }));
  vi.setSystemTime(60000);
  timer.tick();
  timer.tick();
  expect(record).toHaveBeenCalledTimes(1);
  expect(player.getSnapshot().playlistId).toBe("break");
  player.reconcile(playlistFixture("break"));
  vi.setSystemTime(120000);
  timer.tick();
  player.reconcile(playlistFixture());
  expect(player.getSnapshot()).toMatchObject({
    playlistId: "focus",
    itemId: "b",
    position: 42,
  });
});

it("keeps a shared playlist playing across phases", () => {
  const { timer, player } = session(true);
  timer.toggle();
  player.reconcile(playlistFixture());
  const before = player.getSnapshot();
  vi.setSystemTime(60000);
  timer.tick();
  expect(player.getSnapshot()).toBe(before);
});

it("manual selections, queue edits and playback errors cannot change the timer", () => {
  const { timer, player } = session();
  timer.toggle();
  vi.setSystemTime(15000);
  timer.tick();
  const before = timer.getSnapshot();
  player.activate("other");
  player.reconcile(playlistFixture("other"));
  player.select("b");
  player.reconcile(playlistFixture("other", ["c", "b"]));
  player.toggleShuffle();
  player.fail();
  player.fail();
  expect(timer.getSnapshot()).toBe(before);
  expect(before?.configurationSnapshot.focusPlaylistId).toBe("focus");
  vi.setSystemTime(60000);
  timer.tick();
  expect(player.getSnapshot().playlistId).toBe("break");
});

it("null music and pause/resume leave the other subsystem independent", () => {
  const { timer, player } = session();
  timer.configure({ ...configurationFixture, focusPlaylistId: null });
  timer.toggle();
  expect(timer.getSnapshot()?.status).toBe("RUNNING");
  expect(player.getSnapshot().playlistId).toBeNull();
  player.activate("other");
  player.reconcile(playlistFixture("other"));
  timer.toggle();
  timer.toggle();
  expect(player.getSnapshot().playlistId).toBe("other");
});
