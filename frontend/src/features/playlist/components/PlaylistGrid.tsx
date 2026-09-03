import { Music2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PlaylistSummaryResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/states/StandardStates";
import { PlaylistCard } from "./PlaylistCard";

export function PlaylistGrid({
  playlists,
  hasSearch,
  onCreate,
  onDelete,
  onDuplicate,
  onEdit,
}: {
  playlists: PlaylistSummaryResponseDto[];
  hasSearch: boolean;
  onCreate: () => void;
  onDelete: (playlist: PlaylistSummaryResponseDto) => void;
  onDuplicate: (id: string) => void;
  onEdit: (playlist: PlaylistSummaryResponseDto) => void;
}) {
  const translate = useTranslations("playlist");
  if (!playlists.length)
    return (
      <EmptyState
        action={
          hasSearch ? undefined : (
            <Button onClick={onCreate}>
              <Plus />
              {translate("BTN_CREATE_PLAYLIST")}
            </Button>
          )
        }
        description={translate(
          hasSearch
            ? "TXT_SEARCH_EMPTY_DESCRIPTION"
            : "TXT_LIBRARY_EMPTY_DESCRIPTION",
        )}
        title={translate(
          hasSearch ? "TXT_SEARCH_EMPTY_TITLE" : "TXT_LIBRARY_EMPTY_TITLE",
        )}
      />
    );
  return (
    <section aria-labelledby="playlist-grid-title" className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="bg-secondary border-border grid size-10 place-items-center rounded-lg border-2">
          <Music2 className="size-5" />
        </span>
        <div>
          <h2 id="playlist-grid-title" className="text-2xl">
            {translate("TXT_YOUR_PLAYLISTS")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {translate("TXT_LIBRARY_COUNT", { count: playlists.length })}
          </p>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onDelete={() => onDelete(playlist)}
            onDuplicate={() => onDuplicate(playlist.id)}
            onEdit={() => onEdit(playlist)}
          />
        ))}
      </div>
    </section>
  );
}
