import { ListMusic, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MediaItemResponseDto, PlaylistItemResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/states/StandardStates";
import { TrackRow } from "./TrackRow";

export function TrackList({
  current,
  items,
  onMove,
  onOpenSearch,
  onPlay,
  onRemove,
}: {
  current: MediaItemResponseDto | null;
  items: PlaylistItemResponseDto[];
  onMove: (index: number, direction: -1 | 1) => void;
  onOpenSearch: () => void;
  onPlay: (media: MediaItemResponseDto) => void;
  onRemove: (itemId: string) => void;
}) {
  const translate = useTranslations("playlist");
  if (!items.length)
    return (
      <EmptyState
        title={translate("TXT_EMPTY_PLAYLIST_TITLE")}
        description={translate("TXT_EMPTY_PLAYLIST_DESCRIPTION")}
        action={
          <Button onClick={onOpenSearch}>
            <Search />
            {translate("BTN_FIND_VIDEOS")}
          </Button>
        }
      />
    );
  return (
    <section aria-labelledby="track-list-title" className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            className="flex items-center gap-2 text-2xl"
            id="track-list-title"
          >
            <ListMusic />
            {translate("TXT_TRACK_LIST")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {translate("TXT_REORDER_HINT")}
          </p>
        </div>
        <span className="bg-accent-purple border-border rounded-full border-2 px-3 py-1 text-sm font-bold">
          {translate("TXT_TRACK_COUNT", { count: items.length })}
        </span>
      </div>
      <ol className="space-y-3">
        {items.map((item, index) => (
          <TrackRow
            isCurrent={current?.externalMediaId === item.media.externalMediaId}
            isFirst={index === 0}
            isLast={index === items.length - 1}
            item={item}
            key={item.id}
            onMove={(direction) => onMove(index, direction)}
            onPlay={() => onPlay(item.media)}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </ol>
    </section>
  );
}
