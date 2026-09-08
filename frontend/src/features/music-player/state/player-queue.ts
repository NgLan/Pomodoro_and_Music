import type { PlaylistDetailResponseDto } from "@/api";
import type { PlayerState } from "../types/player.types";

export function shuffleQueue(ids: string[], random = Math.random): string[] {
  const queue = [...ids];
  for (let index = queue.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [queue[index], queue[target]] = [queue[target]!, queue[index]!];
  }
  return queue;
}

export function reconcilePlaylist(
  state: PlayerState,
  playlist: PlaylistDetailResponseDto,
): PlayerState {
  if (state.playlistId !== playlist.id) return state;
  const queue = reconcileQueue(state, playlist);
  const kept = state.itemId !== null && queue.includes(state.itemId);
  const oldIndex = state.queue.indexOf(state.itemId ?? "");
  const successor = state.queue
    .slice(oldIndex + 1)
    .find((id) => queue.includes(id));
  const itemId = kept ? state.itemId : (successor ?? queue[0] ?? null);
  return {
    ...state,
    playlist,
    queue,
    itemId,
    position: kept ? state.position : 0,
    isPlaying: state.isPlaying && itemId !== null,
    revision: state.revision + (kept ? 0 : 1),
  };
}

export function stepQueue(state: PlayerState, direction: -1 | 1): PlayerState {
  const queue = state.queue.filter((id) => !state.failedIds.includes(id));
  const index = queue.indexOf(state.itemId ?? "") + direction;
  if (index < 0 && !state.isRepeat) return state;
  const itemId =
    queue[index] ??
    (state.isRepeat ? queue[(index + queue.length) % queue.length] : null);
  if (!itemId) return { ...state, isPlaying: false };
  return {
    ...state,
    itemId,
    position: 0,
    isPlaying: true,
    revision: state.revision + 1,
  };
}

export function skipFailedTrack(state: PlayerState): PlayerState {
  const failedIds = [...new Set([...state.failedIds, state.itemId ?? ""])];
  const offset = state.queue.indexOf(state.itemId ?? "") + 1;
  const candidates = [
    ...state.queue.slice(offset),
    ...state.queue.slice(0, offset),
  ];
  const itemId = candidates.find((id) => !failedIds.includes(id)) ?? null;
  return {
    ...state,
    failedIds,
    itemId,
    position: 0,
    isPlaying: itemId !== null,
    issue: itemId ? "MSG_TRACK_SKIPPED" : "MSG_PLAYER_ERROR",
    revision: state.revision + 1,
  };
}

function reconcileQueue(
  state: PlayerState,
  playlist: PlaylistDetailResponseDto,
) {
  const ids = playlist.items
    .filter((item) => item.media.availability === "AVAILABLE")
    .map((item) => item.id);
  if (!state.isShuffleEnabled) return ids;
  const kept = state.queue.filter((id) => ids.includes(id));
  const added = shuffleQueue(ids.filter((id) => !state.queue.includes(id)));
  return [...kept, ...added];
}
