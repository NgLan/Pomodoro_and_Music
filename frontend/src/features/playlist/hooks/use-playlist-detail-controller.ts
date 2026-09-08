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
    if (
      !playlist ||
      items.reorder.isPending ||
      index + direction < 0 ||
      index + direction >= playlist.items.length
    )
      return;
    const ordered = playlist.items.map((item) => item.id);
    [ordered[index], ordered[index + direction]] = [
      ordered[index + direction]!,
      ordered[index]!,
    ];
    items.reorder.mutate(ordered);
  };
  const remove = (itemId: string) => {
    if (!items.remove.isPending) items.remove.mutate(itemId);
  };
  return { move, remove };
}
