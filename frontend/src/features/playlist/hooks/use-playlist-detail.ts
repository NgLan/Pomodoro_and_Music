"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/providers/auth-provider";
import { getPlaylist } from "../services/playlist-api";

export const playlistDetailKey = (id: string) =>
  ["playlists", "detail", id] as const;

export function usePlaylistDetail(id: string) {
  const { accessToken } = useAuth();
  return useQuery({
    enabled: Boolean(accessToken && id),
    queryKey: playlistDetailKey(id),
    queryFn: () => getPlaylist(accessToken!, id),
  });
}
