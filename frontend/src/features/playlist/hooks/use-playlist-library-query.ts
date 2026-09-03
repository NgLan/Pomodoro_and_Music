"use client";

import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useState } from "react";
import { useAuth } from "@/shared/providers/auth-provider";
import { listPlaylists } from "../services/playlist-api";

export function usePlaylistLibraryQuery() {
  const { accessToken } = useAuth();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const query = useQuery({
    enabled: Boolean(accessToken),
    queryKey: ["playlists", "library", deferredSearch],
    queryFn: () =>
      listPlaylists(accessToken!, {
        search: deferredSearch || undefined,
      }),
  });
  return { ...query, search, setSearch };
}
