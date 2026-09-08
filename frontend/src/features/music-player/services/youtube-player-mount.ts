import type { PlayerStore } from "../state/player-store";
import type { YoutubeApi, YoutubePlayer } from "../types/youtube-player.types";
import {
  connectPlayback,
  handleYoutubeState,
  isCurrentVideo,
} from "./youtube-playback";

export function mountPlayer(
  api: YoutubeApi,
  host: HTMLDivElement,
  store: PlayerStore,
) {
  const target = document.createElement("div");
  host.replaceChildren(target);
  let disconnect = () => {};
  let active = true;
  const timeout = startReadyTimeout(store);
  const ready = () => {
    if (!active) return;
    clearTimeout(timeout);
    disconnect = observePlayer(player, store);
  };
  const player = new api.Player(target, playerOptions(store, ready));
  return () => {
    active = false;
    clearTimeout(timeout);
    disconnect();
    player.destroy();
  };
}

function playerOptions(store: PlayerStore, ready: () => void) {
  return {
    width: "100%",
    height: "200",
    playerVars: { origin: window.location.origin, playsinline: 1 },
    events: createPlayerEvents(store, ready),
  };
}

function createPlayerEvents(store: PlayerStore, ready: () => void) {
  return {
    onReady: ready,
    onStateChange: (event: { data: number; target: YoutubePlayer }) =>
      handleYoutubeState(event.data, event.target, store),
    onError: (event: { data: number; target: YoutubePlayer }) => {
      if (isCurrentVideo(event.target, store)) store.fail();
      else if (!event.target.getVideoUrl())
        setPlayerIssue(store, "MSG_PLAYER_ERROR");
    },
    onAutoplayBlocked: () => setPlayerIssue(store, "MSG_AUTOPLAY_BLOCKED"),
  };
}

function observePlayer(player: YoutubePlayer, store: PlayerStore) {
  const unsubscribe = connectPlayback(player, store);
  const interval = setInterval(() => {
    if (!isCurrentVideo(player, store)) return;
    const position = player.getCurrentTime();
    if (Number.isFinite(position))
      store.update((state) => ({ ...state, position }));
  }, 500);
  return () => {
    unsubscribe();
    clearInterval(interval);
  };
}

export function setPlayerIssue(
  store: PlayerStore,
  issue: "MSG_PLAYER_ERROR" | "MSG_AUTOPLAY_BLOCKED",
) {
  store.update((state) => ({ ...state, isPlaying: false, issue }));
}

function startReadyTimeout(store: PlayerStore) {
  return setTimeout(() => setPlayerIssue(store, "MSG_PLAYER_ERROR"), 15000);
}
