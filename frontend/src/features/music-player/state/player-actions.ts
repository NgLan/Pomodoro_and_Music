import type { PlayerState } from "../types/player.types";
import { skipFailedTrack, stepQueue } from "./player-queue";
import { selectTrack, toggleShuffle } from "./player-selection";

export function createPlaybackActions(
  update: (transform: (state: PlayerState) => PlayerState) => void,
) {
  return {
    select: (id: string) => update((state) => selectTrack(state, id)),
    toggle: () =>
      update((state) => ({
        ...state,
        isPlaying: !state.isPlaying,
        issue: null,
      })),
    pause: () => update((state) => ({ ...state, isPlaying: false })),
    step: (direction: -1 | 1) => update((state) => stepQueue(state, direction)),
    fail: () => update(skipFailedTrack),
    retry: () => update(retryPlayback),
    toggleRepeat: () =>
      update((state) => ({ ...state, isRepeat: !state.isRepeat })),
    toggleShuffle: () => update(toggleShuffle),
  };
}

function retryPlayback(state: PlayerState): PlayerState {
  const itemId = state.itemId ?? state.queue[0] ?? null;
  return {
    ...state,
    itemId,
    isPlaying: Boolean(itemId),
    issue: null,
    failedIds: [],
    providerRevision: state.providerRevision + 1,
  };
}
