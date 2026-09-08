import { GripVertical } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { TrackRowProps } from "../types/track-row.types";
import { PlaylistThumbnail } from "./PlaylistThumbnail";
import { TrackDetails } from "./TrackDetails";
import { TrackActions } from "./TrackActions";

export function TrackRow(props: TrackRowProps) {
  return (
    <li
      aria-current={props.isCurrent ? "true" : undefined}
      onDragOver={(e) => props.onDragOver?.(e, props.index)}
      onDrop={(e) => props.onDrop?.(e, props.index)}
      className={cn(
        "border-border bg-surface hover:bg-surface-blue aria-current:bg-surface-blue grid grid-cols-[auto_56px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border-2 p-3 transition-colors sm:grid-cols-[auto_88px_minmax(0,1fr)_auto_auto]",
        props.isDragging && "opacity-40",
        props.isDragOver &&
          "ring-primary border-primary bg-surface-blue ring-3",
      )}
    >
      <span
        draggable={Boolean(props.onDragStart)}
        onDragStart={(e) => props.onDragStart?.(e, props.index)}
        onDragEnd={props.onDragEnd}
        className="text-muted-foreground hover:text-text -m-1 flex cursor-grab touch-none flex-col items-center rounded p-1 select-none active:cursor-grabbing"
      >
        <GripVertical aria-hidden="true" className="size-5" />
        <span className="text-xs font-bold">{props.item.position + 1}</span>
      </span>
      <PlaylistThumbnail
        alt=""
        className="w-full rounded-lg"
        src={props.item.media.thumbnailUrl}
      />
      <TrackDetails {...props} />
      <TrackActions {...props} />
    </li>
  );
}
