import { expect, it, vi } from "vitest";
import { createPlayerStore } from "./player-store";
import { playlistFixture } from "./player.fixture";

it("restores the item and position when returning to a playlist", () => {
  const player = createPlayerStore();
  player.activate("focus");
  player.reconcile(playlistFixture());
  player.select("b");
  player.update((state) => ({ ...state, position: 90 }));
  player.activate("break");
  player.reconcile(playlistFixture("break"));
  player.activate("focus");
  player.reconcile(playlistFixture());
  expect(player.getSnapshot()).toMatchObject({
    itemId: "b",
    position: 90,
    isPlaying: true,
  });
});

it("ignores stale fetches and does not reload the same playlist", () => {
  const player = createPlayerStore();
  player.activate("focus");
  player.activate("break");
  player.reconcile(playlistFixture());
  expect(player.getSnapshot().playlist).toBeNull();
  player.reconcile(playlistFixture("break"));
  const snapshot = player.getSnapshot();
  player.activate("break");
  expect(player.getSnapshot()).toBe(snapshot);
});

it("reorders sequential navigation without restarting the current item", () => {
  const player = createPlayerStore();
  player.activate("focus");
  player.reconcile(playlistFixture());
  player.select("b");
  const revision = player.getSnapshot().revision;
  player.reconcile(playlistFixture("focus", ["c", "b", "a"]));
  expect(player.getSnapshot().revision).toBe(revision);
  player.step(1);
  expect(player.getSnapshot().itemId).toBe("a");
});

it("deletes the current item, chooses its successor, and stops when empty", () => {
  const player = createPlayerStore();
  player.activate("focus");
  player.reconcile(playlistFixture());
  player.select("b");
  player.reconcile(playlistFixture("focus", ["a", "c"]));
  expect(player.getSnapshot().itemId).toBe("c");
  player.reconcile(playlistFixture("focus", []));
  expect(player.getSnapshot()).toMatchObject({
    itemId: null,
    isPlaying: false,
  });
});

it("keeps shuffle queue through reorder without changing canonical data", () => {
  const random = vi.spyOn(Math, "random").mockReturnValue(0);
  const player = createPlayerStore();
  const playlist = playlistFixture();
  player.activate("focus");
  player.reconcile(playlist);
  player.toggleShuffle();
  const queue = player.getSnapshot().queue;
  player.reconcile(playlistFixture("focus", ["c", "b", "a"]));
  expect(player.getSnapshot().queue).toEqual(queue);
  expect(playlist.items.map((item) => item.id)).toEqual(["a", "b", "c"]);
  random.mockRestore();
});

it("stops at the end unless repeating and bounds unavailable retries", () => {
  const player = createPlayerStore();
  player.activate("focus");
  player.reconcile(playlistFixture());
  player.select("c");
  player.step(1);
  expect(player.getSnapshot().isPlaying).toBe(false);
  player.toggleRepeat();
  player.step(1);
  expect(player.getSnapshot().itemId).toBe("a");
  player.fail();
  player.fail();
  player.fail();
  expect(player.getSnapshot()).toMatchObject({
    itemId: null,
    isPlaying: false,
    issue: "MSG_PLAYER_ERROR",
  });
});
