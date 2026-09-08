import { useState } from "react";
import { usePlaylistDetail } from "./use-playlist-detail";
import { usePlaylistItemActions } from "./use-playlist-item-actions";
import { usePlaylistPlayback } from "./use-playlist-playback";
import { usePlaylistActions } from "./use-playlist-actions";

export function usePlaylistDetailController(id: string) {
  const query = usePlaylistDetail(id);
  const items = usePlaylistItemActions(id);
  const playlists = usePlaylistActions();
  const [isEditing, setIsEditing] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUrlOpen, setIsUrlOpen] = useState(false);
  const playback = usePlaylistPlayback(query.data);
  const edits = trackEdits(query.data, items);
  return {
    query,
    items,
    playlists,
    playback,
    ...edits,
    isEditing,
    setIsEditing,
    isSearchOpen,
    setIsSearchOpen,
    isUrlOpen,
    setIsUrlOpen,
  };
}

function trackEdits(
  playlist: ReturnType<typeof usePlaylistDetail>["data"],
  items: ReturnType<typeof usePlaylistItemActions>,
) {
  const move = (index: number, direction: -1 | 1) => {
    const len = playlist?.items.length ?? 0;
    if (!playlist || items.reorder.isPending || index + direction < 0 || index + direction >= len) return;
    items.reorder.mutate(swapItems(playlist.items.map((i) => i.id), index, direction));
  };
  const reorder = (from: number, to: number) => {
    const len = playlist?.items.length ?? 0;
    if (!playlist || items.reorder.isPending || from === to || from < 0 || to < 0 || from >= len || to >= len) return;
    items.reorder.mutate(moveItem(playlist.items.map((i) => i.id), from, to));
  };
  const remove = (itemId: string) => {
    if (!items.remove.isPending) items.remove.mutate(itemId);
  };
  return { move, reorder, remove };
}

function swapItems(ids: string[], index: number, direction: -1 | 1): string[] {
  const next = [...ids];
  [next[index], next[index + direction]] = [next[index + direction]!, next[index]!];
  return next;
}

function moveItem(ids: string[], from: number, to: number): string[] {
  const next = [...ids];
  const [item] = next.splice(from, 1);
  if (item) next.splice(to, 0, item);
  return next;
}
