import { expect, it } from "vitest";
import { createPlayerStore } from "./player-store";
import { playlistFixture } from "./player.fixture";

it("reinitializes the provider and preserves position when retrying a load failure", () => {
  const store = createPlayerStore();
  store.activate("focus");
  store.reconcile(playlistFixture());
  store.update((state) => ({
    ...state,
    position: 42,
    isPlaying: false,
    issue: "MSG_PLAYER_ERROR",
  }));
  store.retry();
  expect(store.getSnapshot()).toMatchObject({
    itemId: "a",
    position: 42,
    isPlaying: true,
    issue: null,
    providerRevision: 1,
  });
});

it("allows an explicit retry after all tracks failed without an automatic loop", () => {
  const store = createPlayerStore();
  store.activate("focus");
  store.reconcile(playlistFixture("focus", ["a"]));
  store.fail();
  expect(store.getSnapshot().isPlaying).toBe(false);
  store.retry();
  expect(store.getSnapshot()).toMatchObject({
    itemId: "a",
    isPlaying: true,
    failedIds: [],
    providerRevision: 1,
  });
});
