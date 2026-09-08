import { usePlaylistDetail } from "@/features/playlist/hooks/use-playlist-detail";
import { usePlayer } from "../providers/PlayerProvider";

export function usePlayerRetry() {
  const { state, store } = usePlayer();
  const query = usePlaylistDetail(state.playlistId ?? "");
  return async () => {
    const result = await query.refetch();
    if (!result.data || store.getSnapshot().playlistId !== state.playlistId)
      return;
    store.reconcile(result.data);
    store.retry();
  };
}
