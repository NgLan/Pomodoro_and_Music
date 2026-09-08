"use client";
import type { MediaItemResponseDto, PlaylistDetailResponseDto } from "@/api";
import type { PlayerStore } from "@/features/music-player/state/player-store";
import { usePlayer } from "@/features/music-player/providers/PlayerProvider";

export function usePlaylistPlayback(
  playlist: PlaylistDetailResponseDto | undefined,
) {
  const { store, state, current } = usePlayer();
  const play = () => {
    activatePlaylistDetail(playlist, store);
    if (store.getSnapshot().itemId)
      store.update((value) => ({ ...value, isPlaying: true }));
  };
  return {
    current: state.playlistId === playlist?.id ? current : null,
    isRepeat: state.isRepeat,
    isShuffled: state.isShuffleEnabled,
    play,
    select: (media: MediaItemResponseDto) =>
      selectPlaylistTrack(playlist, store, media),
    pause: store.pause,
    step: store.step,
    toggleRepeat: store.toggleRepeat,
    toggleShuffle: store.toggleShuffle,
  };
}

export function selectPlaylistTrack(
  playlist: PlaylistDetailResponseDto | undefined,
  store: PlayerStore,
  media: MediaItemResponseDto,
) {
  if (!playlist) return;
  activatePlaylistDetail(playlist, store);
  const item = playlist?.items.find(
    (entry) => entry.media.externalMediaId === media.externalMediaId,
  );
  if (item) store.select(item.id);
}

function activatePlaylistDetail(
  playlist: PlaylistDetailResponseDto | undefined,
  store: PlayerStore,
) {
  if (!playlist) return;
  store.activate(playlist.id);
  store.reconcile(playlist);
}
