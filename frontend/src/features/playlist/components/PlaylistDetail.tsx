"use client";
import { AppShell, PageContainer } from "@/shared/ui/layout/AppShell";
import { usePlaylistDetailController } from "../hooks/use-playlist-detail-controller";
import { PlaylistDetailContent } from "./PlaylistDetailContent";
import { PlaylistHeader } from "./PlaylistHeader";

export function PlaylistDetail({ id }: { id: string }) {
  const state = usePlaylistDetailController(id);
  return (
    <AppShell header={<PlaylistHeader />}>
      <PageContainer className="space-y-7">
        <PlaylistDetailContent state={state} />
      </PageContainer>
    </AppShell>
  );
}
