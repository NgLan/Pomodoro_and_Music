import type { PlayerState } from "../types/player.types";
import { stepQueue } from "./player-queue";

export function createRepeatActions(
  update: (transform: (state: PlayerState) => PlayerState) => void,
) {
  return {
    toggleRepeat: () =>
      update((state) => ({
        ...state,
        isRepeat: !state.isRepeat,
        isRepeatOne: false,
      })),
    toggleRepeatOne: () =>
      update((state) => ({
        ...state,
        isRepeatOne: !state.isRepeatOne,
        isRepeat: false,
      })),
    ended: () => update(finishTrack),
  };
}

function finishTrack(state: PlayerState): PlayerState {
  if (!state.isRepeatOne) return stepQueue(state, 1);
  if (!state.itemId || state.failedIds.includes(state.itemId)) return state;
  return {
    ...state,
    position: 0,
    seekTarget: null,
    isPlaying: true,
    revision: state.revision + 1,
  };
}
