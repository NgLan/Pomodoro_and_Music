import type { PlayerStore } from "../state/player-store";
import type { PlayerState } from "../types/player.types";
import type { YoutubePlayer } from "../types/youtube-player.types";

export function connectPlayback(player: YoutubePlayer, store: PlayerStore) {
  let previous: PlayerState | null = null;
  const sync = () => {
    const state = store.getSnapshot();
    const last = previous;
    previous = state;
    syncPlayback(player, state, last);
  };
  const unsubscribe = store.subscribe(sync);
  sync();
  return unsubscribe;
}

function syncPlayback(
  player: YoutubePlayer,
  state: PlayerState,
  previous: PlayerState | null,
) {
  const item = state.playlist?.items.find((entry) => entry.id === state.itemId);
  if (!item) {
    if (previous?.playlist) player.stopVideo();
    return;
  }
  if (state.volume !== previous?.volume) player.setVolume(state.volume);
  if (!previous?.playlist || previous.revision !== state.revision) {
    const options = {
      videoId: item.media.externalMediaId,
      startSeconds: state.position,
    };
    if (state.isPlaying) player.loadVideoById(options);
    else player.cueVideoById(options);
  } else if (previous.isPlaying !== state.isPlaying) {
    if (state.isPlaying) player.playVideo();
    else player.pauseVideo();
  }
}

export function isCurrentVideo(player: YoutubePlayer, store: PlayerStore) {
  const state = store.getSnapshot();
  const item = state.playlist?.items.find((entry) => entry.id === state.itemId);
  return Boolean(
    item &&
    item.media.externalMediaId ===
      new URL(player.getVideoUrl(), "https://www.youtube.com").searchParams.get(
        "v",
      ),
  );
}

export function handleYoutubeState(
  code: number,
  player: YoutubePlayer,
  store: PlayerStore,
) {
  if (!isCurrentVideo(player, store)) return;
  if (code === 0) store.step(1);
  if (code === 1 || code === 2)
    store.update((state) => ({
      ...state,
      isPlaying: code === 1,
      issue:
        code === 1 && state.issue === "MSG_AUTOPLAY_BLOCKED"
          ? null
          : state.issue,
    }));
}
