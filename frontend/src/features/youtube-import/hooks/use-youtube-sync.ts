import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/providers/auth-provider";
import { syncYoutubePlaylist } from "../services/youtube-playlist-api";

export function useYoutubeSync(id: string) {
  const { accessToken } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => syncYoutubePlaylist(accessToken!, id),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}
