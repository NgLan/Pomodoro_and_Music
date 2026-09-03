"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { AppShell, PageContainer } from "@/shared/ui/layout/AppShell";
import { ErrorState, LoadingState } from "@/shared/ui/states/StandardStates";
import { usePlaylistActions } from "../hooks/use-playlist-actions";
import { usePlaylistDetail } from "../hooks/use-playlist-detail";
import { usePlaylistItemActions } from "../hooks/use-playlist-item-actions";
import { usePlaylistPlayback } from "../hooks/use-playlist-playback";
import { AddVideoUrlDialog } from "./AddVideoUrlDialog";
import { PlaylistDetailHero } from "./PlaylistDetailHero";
import { PlaylistFormDialog } from "./PlaylistFormDialog";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistMiniPlayer } from "./PlaylistMiniPlayer";
import { PlaylistToolbar } from "./PlaylistToolbar";
import { TrackList } from "./TrackList";
import { YoutubeSearchSheet } from "./YoutubeSearchSheet";

export function PlaylistDetail({ id }: { id: string }) {
  const translate = useTranslations("playlist");
  const query = usePlaylistDetail(id);
  const items = usePlaylistItemActions(id);
  const playlists = usePlaylistActions();
  const [isEditing, setIsEditing] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUrlOpen, setIsUrlOpen] = useState(false);
  const playlist = query.data;
  const playback = usePlaylistPlayback(playlist?.items ?? []);
  const move = (index: number, direction: -1 | 1) => {
    if (!playlist) return;
    const ordered = playlist.items.map((item) => item.id);
    [ordered[index], ordered[index + direction]] = [
      ordered[index + direction]!,
      ordered[index]!,
    ];
    items.reorder.mutate(ordered);
  };
  const remove = (itemId: string) => {
    playback.prepareRemoval(itemId);
    items.remove.mutate(itemId);
  };
  return (
    <AppShell
      header={<PlaylistHeader />}
      miniPlayer={
        playback.current && (
          <PlaylistMiniPlayer
            current={playback.current}
            onNext={() => playback.step(1)}
            onPause={playback.pause}
            onPrevious={() => playback.step(-1)}
          />
        )
      }
      miniPlayerLabel={translate("TXT_MINI_PLAYER")}
    >
      <PageContainer className="space-y-7">
        {query.isLoading ? (
          <LoadingState
            title={translate("TXT_LOADING_PLAYLIST")}
            description={translate("TXT_LOADING_DESCRIPTION")}
          />
        ) : query.isError || !playlist ? (
          <ErrorState
            title={translate("TXT_PLAYLIST_NOT_FOUND")}
            description={translate("TXT_ERROR_DESCRIPTION")}
            action={
              <Button onClick={() => void query.refetch()}>
                {translate("BTN_RETRY")}
              </Button>
            }
          />
        ) : (
          <>
            <PlaylistDetailHero
              playlist={playlist}
              isRepeat={playback.isRepeat}
              isShuffled={playback.isShuffled}
              onEdit={() => setIsEditing(true)}
              onPlay={playback.play}
              onRepeat={playback.toggleRepeat}
              onShuffle={playback.toggleShuffle}
            />
            <PlaylistToolbar
              onAddUrl={() => setIsUrlOpen(true)}
              onSearch={() => setIsSearchOpen(true)}
            />
            <TrackList
              current={playback.current}
              items={playlist.items}
              onMove={move}
              onOpenSearch={() => setIsSearchOpen(true)}
              onPlay={playback.select}
              onRemove={remove}
            />
            <PlaylistFormDialog
              state={isEditing ? { mode: "edit", playlist } : null}
              onClose={() => setIsEditing(false)}
              onSubmit={playlists.save}
            />
            <YoutubeSearchSheet
              isOpen={isSearchOpen}
              onAdd={(videoId) => items.add.mutateAsync(videoId)}
              onOpenChange={setIsSearchOpen}
            />
            <AddVideoUrlDialog
              isOpen={isUrlOpen}
              onAdd={(videoId) => items.add.mutateAsync(videoId)}
              onOpenChange={setIsUrlOpen}
            />
          </>
        )}
      </PageContainer>
    </AppShell>
  );
}
