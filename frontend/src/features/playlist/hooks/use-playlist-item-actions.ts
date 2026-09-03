"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PlaylistDetailResponseDto } from "@/api";
import { useAppNotification } from "@/shared/hooks/use-app-notification";
import { normalizeApiError } from "@/shared/lib/api-error";
import { useAuth } from "@/shared/providers/auth-provider";
import {
  addPlaylistVideo,
  deletePlaylistItem,
  reorderPlaylistItems,
} from "../services/playlist-item-api";
import { playlistDetailKey } from "./use-playlist-detail";

export function usePlaylistItemActions(playlistId: string) {
  const { accessToken } = useAuth();
  const client = useQueryClient();
  const notification = useAppNotification();
  const setDetail = (value: PlaylistDetailResponseDto) => {
    client.setQueryData(playlistDetailKey(playlistId), value);
    void client.invalidateQueries({ queryKey: ["playlists", "library"] });
  };
  const add = useMutation({
    mutationFn: (videoId: string) =>
      addPlaylistVideo(accessToken!, playlistId, videoId),
    onSuccess: (value) => {
      setDetail(value);
      notification.success("MSG_TRACK_ADDED");
    },
    onError: (error) => notification.error(normalizeApiError(error).errorCode),
  });
  const remove = useMutation({
    mutationFn: (itemId: string) =>
      deletePlaylistItem(accessToken!, playlistId, itemId),
    onSuccess: (value) => {
      setDetail(value);
      notification.success("MSG_TRACK_REMOVED");
    },
    onError: (error) => notification.error(normalizeApiError(error).errorCode),
  });
  const reorder = useReorderMutation(
    playlistId,
    accessToken!,
    client,
    notification,
  );
  return { add, remove, reorder };
}

function useReorderMutation(
  playlistId: string,
  accessToken: string,
  client: ReturnType<typeof useQueryClient>,
  notification: ReturnType<typeof useAppNotification>,
) {
  return useMutation({
    mutationFn: (itemIds: string[]) =>
      reorderPlaylistItems(accessToken, playlistId, itemIds),
    onMutate: async (itemIds) => {
      const key = playlistDetailKey(playlistId);
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<PlaylistDetailResponseDto>(key);
      if (previous) client.setQueryData(key, reorderDetail(previous, itemIds));
      return { previous };
    },
    onSuccess: (value) =>
      client.setQueryData(playlistDetailKey(playlistId), value),
    onError: (error, _ids, context) => {
      if (context?.previous)
        client.setQueryData(playlistDetailKey(playlistId), context.previous);
      notification.error(normalizeApiError(error).errorCode);
    },
  });
}

function reorderDetail(
  detail: PlaylistDetailResponseDto,
  itemIds: string[],
): PlaylistDetailResponseDto {
  const byId = new Map(detail.items.map((item) => [item.id, item]));
  return {
    ...detail,
    items: itemIds.map((id, position) => ({ ...byId.get(id)!, position })),
  };
}
