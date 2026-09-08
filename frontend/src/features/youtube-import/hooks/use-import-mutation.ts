import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { YoutubePlaylistImportRequestDto } from "@/api";
import { useAuth } from "@/shared/providers/auth-provider";
import { importYoutubePlaylist } from "../services/youtube-playlist-api";

export function useImportMutation(
  input: () => YoutubePlaylistImportRequestDto,
) {
  const { accessToken } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => importYoutubePlaylist(accessToken!, input()),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}
