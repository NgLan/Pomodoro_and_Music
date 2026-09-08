import type { PlaylistDetailResponseDto } from "@/api";
import type { usePlaylistDetailController } from "../hooks/use-playlist-detail-controller";
import { PlaylistFormDialog } from "./PlaylistFormDialog";
import { YoutubeSearchSheet } from "./YoutubeSearchSheet";
import { AddVideoUrlDialog } from "./AddVideoUrlDialog";

type DialogsProps = {
  state: ReturnType<typeof usePlaylistDetailController>;
  playlist: PlaylistDetailResponseDto;
};
export function PlaylistDetailDialogs({ state, playlist }: DialogsProps) {
  const editor = {
    state: state.isEditing ? { mode: "edit" as const, playlist } : null,
    onClose: () => state.setIsEditing(false),
    onSubmit: state.playlists.save,
  };
  const onAdd = (videoId: string) => state.items.add.mutateAsync(videoId);
  return (
    <>
      <PlaylistFormDialog {...editor} />
      <YoutubeSearchSheet
        isOpen={state.isSearchOpen}
        onAdd={onAdd}
        onOpenChange={state.setIsSearchOpen}
      />
      <AddVideoUrlDialog
        isOpen={state.isUrlOpen}
        onAdd={onAdd}
        onOpenChange={state.setIsUrlOpen}
      />
    </>
  );
}
