"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PlaylistMetadataRequestDto } from "@/api";
import { useAppNotification } from "@/shared/hooks/use-app-notification";
import { normalizeApiError } from "@/shared/lib/api-error";
import { useAuth } from "@/shared/providers/auth-provider";
import {
  createPlaylist,
  deletePlaylist,
  duplicatePlaylist,
  updatePlaylist,
} from "../services/playlist-api";

export function usePlaylistActions() {
  const { accessToken } = useAuth();
  const client = useQueryClient();
  const notification = useAppNotification();
  const saveMutation = useMutation({
    mutationFn: ({
      body,
      id,
    }: {
      body: PlaylistMetadataRequestDto;
      id?: string;
    }) =>
      id
        ? updatePlaylist(accessToken!, id, body)
        : createPlaylist(accessToken!, body),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePlaylist(accessToken!, id),
  });
  const duplicateMutation = useMutation({
    mutationFn: (id: string) => duplicatePlaylist(accessToken!, id),
  });
  const refresh = () => client.invalidateQueries({ queryKey: ["playlists"] });
  const run = async <T>(
    action: () => Promise<T>,
    message:
      | "MSG_PLAYLIST_CREATED"
      | "MSG_PLAYLIST_UPDATED"
      | "MSG_PLAYLIST_DELETED"
      | "MSG_PLAYLIST_DUPLICATED",
  ) => {
    try {
      const value = await action();
      await refresh();
      notification.success(message);
      return value;
    } catch (error) {
      notification.error(normalizeApiError(error).errorCode);
      throw error;
    }
  };
  return {
    save: (body: PlaylistMetadataRequestDto, id?: string) =>
      run(
        () => saveMutation.mutateAsync({ body, id }),
        id ? "MSG_PLAYLIST_UPDATED" : "MSG_PLAYLIST_CREATED",
      ),
    remove: (id: string) =>
      run(() => deleteMutation.mutateAsync(id), "MSG_PLAYLIST_DELETED"),
    duplicate: (id: string) =>
      run(() => duplicateMutation.mutateAsync(id), "MSG_PLAYLIST_DUPLICATED"),
    isPending:
      saveMutation.isPending ||
      deleteMutation.isPending ||
      duplicateMutation.isPending,
  };
}
