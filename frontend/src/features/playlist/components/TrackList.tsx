"use client";

import { useState } from "react";
import { ListMusic, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MediaItemResponseDto, PlaylistItemResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/states/StandardStates";
import { TrackRow } from "./TrackRow";

interface TrackListProps {
  current: MediaItemResponseDto | null;
  items: PlaylistItemResponseDto[];
  onMove: (index: number, direction: -1 | 1) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onOpenSearch: () => void;
  onPlay: (media: MediaItemResponseDto) => void;
  onRemove: (itemId: string) => void;
}

function useTrackDrag(onReorder?: (from: number, to: number) => void) {
  const [dragged, setDragged] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const onStart = (e: React.DragEvent<HTMLElement>, i: number) => {
    setDragged(i);
    e.dataTransfer.setData("text/plain", String(i));
    e.dataTransfer.effectAllowed = "move";
  };
  const onOver = (e: React.DragEvent<HTMLElement>, i: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(i);
  };
  const onDrop = (e: React.DragEvent<HTMLElement>, i: number) => {
    e.preventDefault();
    if (dragged !== null && dragged !== i && onReorder) onReorder(dragged, i);
    setDragged(null);
    setDragOver(null);
  };
  const onEnd = () => {
    setDragged(null);
    setDragOver(null);
  };
  return { dragged, dragOver, onStart, onOver, onDrop, onEnd };
}

export function TrackList(props: TrackListProps) {
  const drag = useTrackDrag(props.onReorder);
  if (!props.items.length) return <TrackListEmpty onOpenSearch={props.onOpenSearch} />;
  return (
    <section aria-labelledby="track-list-title" className="space-y-4">
      <TrackListHeader count={props.items.length} />
      <TrackListItems props={props} drag={drag} />
    </section>
  );
}

function TrackListEmpty({ onOpenSearch }: { onOpenSearch: () => void }) {
  const t = useTranslations("playlist");
  return (
    <EmptyState
      title={t("TXT_EMPTY_PLAYLIST_TITLE")}
      description={t("TXT_EMPTY_PLAYLIST_DESCRIPTION")}
      action={
        <Button onClick={onOpenSearch}>
          <Search />
          {t("BTN_FIND_VIDEOS")}
        </Button>
      }
    />
  );
}

function TrackListItems({ props, drag }: { props: TrackListProps; drag: ReturnType<typeof useTrackDrag> }) {
  return (
    <ol className="space-y-3">
      {props.items.map((item, index) => (
        <TrackRow
          key={item.id}
          index={index}
          item={item}
          isCurrent={props.current?.externalMediaId === item.media.externalMediaId}
          isFirst={index === 0}
          isLast={index === props.items.length - 1}
          isDragging={drag.dragged === index}
          isDragOver={drag.dragOver === index}
          onMove={(dir) => props.onMove(index, dir)}
          onPlay={() => props.onPlay(item.media)}
          onRemove={() => props.onRemove(item.id)}
          onDragStart={drag.onStart}
          onDragOver={drag.onOver}
          onDragEnd={drag.onEnd}
          onDrop={drag.onDrop}
        />
      ))}
    </ol>
  );
}

function TrackListHeader({ count }: { count: number }) {
  const t = useTranslations("playlist");
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold" id="track-list-title">
          <ListMusic />
          {t("TXT_TRACK_LIST")}
        </h2>
        <p className="text-muted-foreground text-sm">{t("TXT_REORDER_HINT")}</p>
      </div>
      <span className="bg-accent-purple border-border rounded-full border-2 px-3 py-1 text-sm font-bold">
        {t("TXT_TRACK_COUNT", { count })}
      </span>
    </div>
  );
}
