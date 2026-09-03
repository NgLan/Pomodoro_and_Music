"use client";

import { useState } from "react";
import type { PlaylistSummaryResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { AppShell, PageContainer } from "@/shared/ui/layout/AppShell";
import { ErrorState, LoadingState } from "@/shared/ui/states/StandardStates";
import { useTranslations } from "next-intl";
import { usePlaylistActions } from "../hooks/use-playlist-actions";
import { usePlaylistLibraryQuery } from "../hooks/use-playlist-library-query";
import type { PlaylistDialogState } from "../types/playlist-ui.types";
import { DeletePlaylistDialog } from "./DeletePlaylistDialog";
import { PlaylistFormDialog } from "./PlaylistFormDialog";
import { PlaylistGrid } from "./PlaylistGrid";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistLibraryHero } from "./PlaylistLibraryHero";

export function PlaylistLibrary() {
  const translate = useTranslations("playlist");
  const query = usePlaylistLibraryQuery();
  const actions = usePlaylistActions();
  const [dialog, setDialog] = useState<PlaylistDialogState>(null);
  const [deleting, setDeleting] = useState<PlaylistSummaryResponseDto | null>(
    null,
  );
  const confirmDelete = async () => {
    if (!deleting) return;
    await actions.remove(deleting.id);
    setDeleting(null);
  };
  return (
    <AppShell header={<PlaylistHeader />}>
      <PageContainer className="space-y-8">
        <PlaylistLibraryHero
          search={query.search}
          onCreate={() => setDialog({ mode: "create", playlist: null })}
          onSearch={query.setSearch}
        />
        {query.isLoading ? (
          <LoadingState
            title={translate("TXT_LOADING_LIBRARY")}
            description={translate("TXT_LOADING_DESCRIPTION")}
          />
        ) : query.isError ? (
          <ErrorState
            title={translate("TXT_ERROR_TITLE")}
            description={translate("TXT_ERROR_DESCRIPTION")}
            action={
              <Button onClick={() => void query.refetch()}>
                {translate("BTN_RETRY")}
              </Button>
            }
          />
        ) : (
          <PlaylistGrid
            playlists={query.data ?? []}
            hasSearch={Boolean(query.search.trim())}
            onCreate={() => setDialog({ mode: "create", playlist: null })}
            onDelete={setDeleting}
            onDuplicate={(id) => void actions.duplicate(id)}
            onEdit={(playlist) => setDialog({ mode: "edit", playlist })}
          />
        )}
      </PageContainer>
      <PlaylistFormDialog
        state={dialog}
        onClose={() => setDialog(null)}
        onSubmit={actions.save}
      />
      <DeletePlaylistDialog
        playlist={deleting}
        isPending={actions.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </AppShell>
  );
}
