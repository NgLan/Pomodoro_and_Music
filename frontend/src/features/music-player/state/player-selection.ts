import type { PlayerState, PlaylistCursor } from "../types/player.types";
import { shuffleQueue } from "./player-queue";

const EMPTY_CURSOR = { itemId: null, position: 0, queue: [] };

export function activatePlaylist(
  state: PlayerState,
  playlistId: string | null,
): PlayerState {
  if (playlistId === state.playlistId) return state;
  const cursors = { ...state.cursors };
  if (state.playlistId) cursors[state.playlistId] = saveCursor(state);
  const cursor = restoreCursor(
    (playlistId && cursors[playlistId]) || EMPTY_CURSOR,
    state,
  );
  return {
    ...state,
    ...cursor,
    cursors,
    playlistId,
    playlist: null,
    isPlaying: Boolean(playlistId),
    failedIds: [],
    issue: null,
    revision: state.revision + 1,
  };
}

function saveCursor(state: PlayerState) {
  return {
    itemId: state.itemId,
    position: state.position,
    queue: state.queue,
    shuffleEnabled: state.isShuffleEnabled,
  };
}

function restoreCursor(cursor: PlaylistCursor, state: PlayerState) {
  if (!state.isShuffleEnabled || cursor.shuffleEnabled) return cursor;
  return { ...cursor, queue: shuffleQueue(cursor.queue) };
}

export function selectTrack(state: PlayerState, itemId: string): PlayerState {
  if (!state.queue.includes(itemId)) return state;
  return {
    ...state,
    itemId,
    position: 0,
    isPlaying: true,
    failedIds: [],
    issue: null,
    revision: state.revision + 1,
  };
}

export function toggleShuffle(state: PlayerState): PlayerState {
  const canonical =
    state.playlist?.items
      .filter((item) => item.media.availability === "AVAILABLE")
      .map((item) => item.id) ?? [];
  const shuffled = [
    state.itemId,
    ...shuffleQueue(state.queue.filter((id) => id !== state.itemId)),
  ].filter((id): id is string => id !== null);
  return {
    ...state,
    isShuffleEnabled: !state.isShuffleEnabled,
    queue: state.isShuffleEnabled ? canonical : shuffled,
  };
}
