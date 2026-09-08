"use client";
import { useImportMutation } from "./use-import-mutation";
import { selectableVideoIds } from "../utils/selectable-video-ids";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/shared/providers/auth-provider";
import { previewYoutubePlaylist } from "../services/youtube-playlist-api";

export function useYoutubeImport() {
  const { accessToken } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const preview = useMutation({
    mutationFn: (url: string) => previewYoutubePlaylist(accessToken!, url),
    onSuccess: (value) => {
      setName(value.title.slice(0, 255));
      setSelected(selectableVideoIds(value));
    },
  });
  const importer = useImportMutation(() => ({
    url: preview.data!.sourceUrl,
    name: name.trim(),
    selectedVideoIds: [...selected],
  }));
  return { preview, importer, selected, setSelected, name, setName };
}
