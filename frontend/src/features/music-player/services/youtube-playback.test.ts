import { expect, it } from "vitest";
import { createPlayerStore } from "../state/player-store";
import { playlistFixture } from "../state/player.fixture";
import { connectPlayback, handleYoutubeState } from "./youtube-playback";
import { youtubeFixture } from "./youtube-player.fixture";

it("uses one load for position updates, reorder and a shared phase playlist", () => {
  const store = createPlayerStore();
  const youtube = youtubeFixture();
  store.activate("focus");
  store.reconcile(playlistFixture());
  const disconnect = connectPlayback(youtube, store);
  store.update((state) => ({ ...state, position: 12 }));
  store.reconcile(playlistFixture("focus", ["c", "a", "b"]));
  store.activate("focus");
  expect(youtube.loadVideoById).toHaveBeenCalledTimes(1);
  store.pause();
  expect(youtube.pauseVideo).toHaveBeenCalledTimes(1);
  disconnect();
  store.select("b");
  expect(youtube.loadVideoById).toHaveBeenCalledTimes(1);
});

it("restores a cursor through the supported loadVideoById API", () => {
  const store = createPlayerStore();
  const youtube = youtubeFixture();
  store.activate("focus");
  store.reconcile(playlistFixture());
  const disconnect = connectPlayback(youtube, store);
  store.update((state) => ({ ...state, position: 12 }));
  store.activate("break");
  store.reconcile(playlistFixture("break"));
  store.activate("focus");
  store.reconcile(playlistFixture());
  expect(youtube.loadVideoById).toHaveBeenLastCalledWith({
    videoId: "a",
    startSeconds: 12,
  });
  disconnect();
});

it("ignores delayed events for a previous video and advances on ended", () => {
  const store = createPlayerStore();
  const youtube = youtubeFixture();
  store.activate("focus");
  store.reconcile(playlistFixture());
  handleYoutubeState(0, youtube, store);
  expect(store.getSnapshot().itemId).toBe("b");
  handleYoutubeState(2, youtube, store);
  expect(store.getSnapshot().isPlaying).toBe(true);
});

it("calls seekTo on the player when store.seek is called", () => {
  const store = createPlayerStore();
  const youtube = youtubeFixture();
  store.activate("focus");
  store.reconcile(playlistFixture());
  const disconnect = connectPlayback(youtube, store);
  store.seek(75);
  expect(youtube.seekTo).toHaveBeenCalledWith(75, true);
  disconnect();
});
