import { GripVertical } from "lucide-react";
import type { TrackRowProps } from "../types/track-row.types";
import { PlaylistThumbnail } from "./PlaylistThumbnail";
import { TrackDetails } from "./TrackDetails";
import { TrackActions } from "./TrackActions";

export function TrackRow(props: TrackRowProps) {
  return (
    <li
      aria-current={props.isCurrent ? "true" : undefined}
      className="border-border bg-surface hover:bg-surface-blue aria-current:bg-surface-blue grid grid-cols-[auto_56px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border-2 p-3 transition-colors sm:grid-cols-[auto_88px_minmax(0,1fr)_auto_auto]"
    >
      <span className="text-muted-foreground flex flex-col items-center">
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
