"use client";
import { useTranslations } from "next-intl";
import { AppShell, PageContainer } from "@/shared/ui/layout/AppShell";
import { usePlaylistDetailController } from "../hooks/use-playlist-detail-controller";
import { PlaylistDetailContent } from "./PlaylistDetailContent";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistMiniPlayer } from "./PlaylistMiniPlayer";

export function PlaylistDetail({ id }: { id: string }) {
  const t = useTranslations("playlist");
  const state = usePlaylistDetailController(id);
  return (
    <AppShell
      header={<PlaylistHeader />}
      miniPlayer={state.playback.current && <DetailPlayer state={state} />}
      miniPlayerLabel={t("TXT_MINI_PLAYER")}
    >
      <PageContainer className="space-y-7">
        <PlaylistDetailContent state={state} />
      </PageContainer>
    </AppShell>
  );
}

function DetailPlayer({
  state,
}: {
  state: ReturnType<typeof usePlaylistDetailController>;
}) {
  const { playback } = state;
  if (!playback.current) return null;
  return (
    <PlaylistMiniPlayer
      current={playback.current}
      onNext={() => playback.step(1)}
      onPause={playback.pause}
      onPrevious={() => playback.step(-1)}
    />
  );
}
