import { useEffect, useRef } from "react";
import { loadYoutubeApi } from "../services/youtube-api-loader";
import { mountPlayer, setPlayerIssue } from "../services/youtube-player-mount";
import type { PlayerStore } from "../state/player-store";

export function useYoutubePlayer(store: PlayerStore, attempt: number) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    void loadYoutubeApi()
      .then((api) => {
        if (!disposed && host.current)
          cleanup = mountPlayer(api, host.current, store);
      })
      .catch(() => {
        if (!disposed) setPlayerIssue(store, "MSG_PLAYER_ERROR");
      });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [store, attempt]);
  return host;
}
