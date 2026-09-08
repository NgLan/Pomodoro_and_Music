import { useTranslations } from "next-intl";
import { PlaylistSourceSync } from "@/features/youtube-import/components/PlaylistSourceSync";
import { Button } from "@/shared/ui/button";
import { ErrorState, LoadingState } from "@/shared/ui/states/StandardStates";
import type { usePlaylistDetailController } from "../hooks/use-playlist-detail-controller";
import { PlaylistDetailHero } from "./PlaylistDetailHero";
import { PlaylistDetailDialogs } from "./PlaylistDetailDialogs";
import { PlaylistToolbar } from "./PlaylistToolbar";
import { TrackList } from "./TrackList";

type DetailState = ReturnType<typeof usePlaylistDetailController>;
export function PlaylistDetailContent({ state }: { state: DetailState }) {
  const { query } = state;
  if (query.isLoading || query.isError || !query.data)
    return <DetailQueryState state={state} />;
  return (
    <>
      <DetailHero state={state} />
      <PlaylistSourceSync playlist={query.data} />
      <PlaylistToolbar
        onAddUrl={() => state.setIsUrlOpen(true)}
        onSearch={() => state.setIsSearchOpen(true)}
      />
      <DetailTracks state={state} />
      <PlaylistDetailDialogs state={state} playlist={query.data} />
    </>
  );
}

function DetailQueryState({ state }: { state: DetailState }) {
  const t = useTranslations("playlist");
  if (state.query.isLoading)
    return (
      <LoadingState
        title={t("TXT_LOADING_PLAYLIST")}
        description={t("TXT_LOADING_DESCRIPTION")}
      />
    );
  const retry = (
    <Button onClick={() => void state.query.refetch()}>{t("BTN_RETRY")}</Button>
  );
  return (
    <ErrorState
      title={t("TXT_PLAYLIST_NOT_FOUND")}
      description={t("TXT_ERROR_DESCRIPTION")}
      action={retry}
    />
  );
}

function DetailHero({ state }: { state: DetailState }) {
  const { playback, query } = state;
  return (
    <PlaylistDetailHero
      playlist={query.data!}
      isRepeat={playback.isRepeat}
      isShuffled={playback.isShuffled}
      onEdit={() => state.setIsEditing(true)}
      onPlay={playback.play}
      onRepeat={playback.toggleRepeat}
      onShuffle={playback.toggleShuffle}
    />
  );
}

function DetailTracks({ state }: { state: DetailState }) {
  return (
    <TrackList
      current={state.playback.current}
      items={state.query.data!.items}
      onMove={state.move}
      onReorder={state.reorder}
      onOpenSearch={() => state.setIsSearchOpen(true)}
      onPlay={state.playback.select}
      onRemove={state.remove}
    />
  );
}
