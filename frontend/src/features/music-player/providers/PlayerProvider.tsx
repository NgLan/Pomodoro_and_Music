"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePlaylistDetail } from "@/features/playlist/hooks/use-playlist-detail";
import { createPlayerStore, type PlayerStore } from "../state/player-store";

const PlayerContext = createContext<PlayerStore | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createPlayerStore);
  return (
    <PlayerContext.Provider value={store}>
      <PlaylistObserver />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerStore() {
  const store = useContext(PlayerContext);
  if (!store) throw new Error("PlayerProvider is required");
  return store;
}

export function usePlayer() {
  const store = usePlayerStore();
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  const current =
    state.playlist?.items.find((item) => item.id === state.itemId)?.media ??
    null;
  return { store, state, current };
}

function PlaylistObserver() {
  const { store, state } = usePlayer();
  const query = usePlaylistDetail(state.playlistId ?? "");
  useEffect(() => {
    if (query.data) store.reconcile(query.data);
  }, [query.data, store]);
  useEffect(() => {
    if (query.isError)
      store.update((current) =>
        current.playlistId !== state.playlistId
          ? current
          : {
              ...current,
              isPlaying: false,
              issue: "MSG_PLAYER_ERROR",
            },
      );
  }, [query.isError, state.playlistId, store]);
  return null;
}
