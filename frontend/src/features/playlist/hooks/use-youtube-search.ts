"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/shared/providers/auth-provider";
import {
  resolveYoutubeVideo,
  searchYoutubeVideos,
} from "../services/youtube-video-api";

export function useYoutubeSearch() {
  const { accessToken } = useAuth();
  const [results, setResults] = useState<
    Awaited<ReturnType<typeof searchYoutubeVideos>>
  >([]);
  const search = useMutation({
    mutationFn: (query: string) => searchYoutubeVideos(accessToken!, query),
    onSuccess: setResults,
  });
  const resolve = useMutation({
    mutationFn: (url: string) => resolveYoutubeVideo(accessToken!, url),
  });
  return { search, resolve, results };
}
