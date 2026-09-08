"use client";
import { PlaylistHeader } from "@/features/playlist/components/PlaylistHeader";
import { AppShell, PageContainer } from "@/shared/ui/layout/AppShell";
import { useYoutubeImport } from "../hooks/use-youtube-import";
import { ImportHero, ImportBackLink } from "./ImportHero";
import { ImportContent } from "./ImportContent";

export function YoutubeImportWorkspace() {
  const state = useYoutubeImport();
  return (
    <AppShell header={<PlaylistHeader />}>
      <PageContainer className="space-y-7">
        <ImportBackLink />
        <ImportHero state={state} />
        <ImportContent state={state} />
      </PageContainer>
    </AppShell>
  );
}
