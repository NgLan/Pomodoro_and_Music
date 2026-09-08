import { expect, it } from "vitest";
import { createPlayerStore } from "./player-store";
import { playlistFixture } from "./player.fixture";
import {
  connectPlayback,
  handleYoutubeState,
} from "../services/youtube-playback";
import { youtubeFixture } from "../services/youtube-player.fixture";

function playingStore() {
  const store = createPlayerStore();
  store.activate("focus");
  store.reconcile(playlistFixture());
  return store;
}

it("reloads the same video from zero on every end, including with shuffle", () => {
  const store = playingStore();
  const youtube = youtubeFixture();
  const disconnect = connectPlayback(youtube, store);
  store.toggleShuffle();
  store.toggleRepeatOne();
  store.seek(75);
  handleYoutubeState(0, youtube, store);
  handleYoutubeState(0, youtube, store);
  expect(store.getSnapshot()).toMatchObject({
    itemId: "a",
    position: 0,
    seekTarget: null,
    isPlaying: true,
  });
  expect(youtube.loadVideoById).toHaveBeenCalledTimes(3);
  expect(youtube.loadVideoById).toHaveBeenLastCalledWith({
    videoId: "a",
    startSeconds: 0,
  });
  disconnect();
});

it("allows manual navigation and skips failed tracks while repeating one", () => {
  const store = playingStore();
  store.toggleRepeatOne();
  store.step(1);
  expect(store.getSnapshot().itemId).toBe("b");
  store.step(-1);
  expect(store.getSnapshot().itemId).toBe("a");
  store.fail();
  expect(store.getSnapshot().itemId).toBe("b");
  store.ended();
  expect(store.getSnapshot().itemId).toBe("b");
});

it("keeps repeat modes exclusive and resumes normal advancement when disabled", () => {
  const store = playingStore();
  store.toggleRepeat();
  store.toggleRepeatOne();
  expect(store.getSnapshot()).toMatchObject({
    isRepeat: false,
    isRepeatOne: true,
  });
  store.toggleRepeat();
  expect(store.getSnapshot()).toMatchObject({
    isRepeat: true,
    isRepeatOne: false,
  });
  store.toggleRepeatOne();
  store.toggleRepeatOne();
  store.ended();
  expect(store.getSnapshot().itemId).toBe("b");
  store.select("c");
  store.ended();
  expect(store.getSnapshot().isPlaying).toBe(false);
});
