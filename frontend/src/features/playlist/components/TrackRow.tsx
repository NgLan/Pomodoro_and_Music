import { GripVertical, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PlaylistItemResponseDto } from "@/api";
import { formatDuration } from "@/shared/utils/duration";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { PlaylistThumbnail } from "./PlaylistThumbnail";
import { TrackMenu } from "./TrackMenu";

export function TrackRow({
  item,
  isCurrent,
  isFirst,
  isLast,
  onMove,
  onPlay,
  onRemove,
}: {
  item: PlaylistItemResponseDto;
  isCurrent: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onPlay: () => void;
  onRemove: () => void;
}) {
  const translate = useTranslations("playlist");
  const isAvailable = item.media.availability === "AVAILABLE";
  return (
    <li className="border-border bg-surface hover:bg-surface-blue grid grid-cols-[auto_72px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border-2 p-3 transition-colors sm:grid-cols-[auto_88px_minmax(0,1fr)_auto_auto]">
      <span className="text-muted-foreground flex flex-col items-center">
        <GripVertical aria-hidden="true" className="size-5" />
        <span className="text-xs font-bold">{item.position + 1}</span>
      </span>
      <PlaylistThumbnail
        alt=""
        className="w-full rounded-lg"
        src={item.media.thumbnailUrl}
      />
      <div className="min-w-0">
        <button
          className="block max-w-full text-left font-bold hover:underline disabled:no-underline"
          disabled={!isAvailable}
          onClick={onPlay}
          type="button"
        >
          <span className="block truncate">
            {item.media.title || translate("TXT_UNKNOWN_TRACK")}
          </span>
        </button>
        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span>
            {item.media.channelName || translate("TXT_UNKNOWN_CHANNEL")}
          </span>
          {item.media.durationSeconds !== null && (
            <span>• {formatDuration(item.media.durationSeconds)}</span>
          )}
          {!isAvailable && (
            <Badge variant="destructive">{translate("TXT_UNAVAILABLE")}</Badge>
          )}
        </div>
      </div>
      <Button
        aria-label={translate("ARIA_PLAY_TRACK", {
          title: item.media.title ?? "",
        })}
        className="hidden sm:inline-flex"
        disabled={!isAvailable}
        onClick={onPlay}
        size="icon-sm"
        variant={isCurrent ? "secondary" : "ghost"}
      >
        <Play fill={isCurrent ? "currentColor" : "none"} />
      </Button>
      <TrackMenu
        isFirst={isFirst}
        isLast={isLast}
        onMove={onMove}
        onRemove={onRemove}
      />
    </li>
  );
}
