import { youtubeFixture } from "./youtube-player.fixture";
import { afterEach, expect, it, vi } from "vitest";
import { createPlayerStore } from "../state/player-store";
import { playlistFixture } from "../state/player.fixture";
import type { YoutubeApi } from "../types/youtube-player.types";
import { mountPlayer } from "./youtube-player-mount";

afterEach(() => vi.useRealTimers());

function mountFixture() {
  vi.useFakeTimers();
  let events: ConstructorParameters<YoutubeApi["Player"]>[1]["events"];
  const youtube = youtubeFixture();
  const api: YoutubeApi = {
    Player: class {
      constructor(
        _target: HTMLElement,
        options: ConstructorParameters<YoutubeApi["Player"]>[1],
      ) {
        events = options.events;
        return youtube;
      }
    } as YoutubeApi["Player"],
  };
  const store = createPlayerStore();
  store.activate("focus");
  store.reconcile(playlistFixture());
  const dispose = mountPlayer(api, document.createElement("div"), store);
  return { store, youtube, dispose, events: () => events! };
}

it("does not attach playback or timers when ready arrives after unmount", () => {
  const mounted = mountFixture();
  mounted.dispose();
  mounted.events().onReady();
  expect(mounted.youtube.destroy).toHaveBeenCalledOnce();
  expect(mounted.youtube.loadVideoById).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
});

it("exposes autoplay blocking and synchronizes a native play gesture", () => {
  const mounted = mountFixture();
  mounted.events().onReady();
  mounted.events().onAutoplayBlocked();
  expect(mounted.store.getSnapshot()).toMatchObject({
    isPlaying: false,
    issue: "MSG_AUTOPLAY_BLOCKED",
  });
  mounted.events().onStateChange({ data: 1, target: mounted.youtube });
  expect(mounted.store.getSnapshot()).toMatchObject({
    isPlaying: true,
    issue: null,
  });
  mounted.dispose();
  expect(vi.getTimerCount()).toBe(0);
});
