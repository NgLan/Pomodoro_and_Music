import type { PlaylistDetailResponseDto } from "@/api";
import type { PlayerState } from "../types/player.types";
import { reconcilePlaylist } from "./player-queue";
import { activatePlaylist } from "./player-selection";
import { createPlaybackActions } from "./player-actions";

export const initialPlayerState: PlayerState = {
  playlistId: null,
  playlist: null,
  itemId: null,
  position: 0,
  queue: [],
  cursors: {},
  isPlaying: false,
  isShuffleEnabled: false,
  isRepeat: false,
  failedIds: [],
  issue: null,
  revision: 0,
  providerRevision: 0,
  volume: 60,
};

/** Session-scoped store. Synchronous intents make the last selection win, regardless of fetch order. */
export function createPlayerStore() {
  let state = initialPlayerState;
  const listeners = new Set<() => void>();
  const update = (transform: (current: PlayerState) => PlayerState) => {
    const next = transform(state);
    if (next === state) return;
    state = next;
    listeners.forEach((listener) => listener());
  };
  return {
    getSnapshot: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    activate: (id: string | null) =>
      update((current) => activatePlaylist(current, id)),
    reconcile: (playlist: PlaylistDetailResponseDto) =>
      update((current) => reconcilePlaylist(current, playlist)),
    update,
    ...createPlaybackActions(update),
  };
}

export type PlayerStore = ReturnType<typeof createPlayerStore>;
