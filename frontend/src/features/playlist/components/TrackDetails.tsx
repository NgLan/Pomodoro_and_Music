import { useTranslations } from "next-intl";
import { formatDuration } from "@/shared/utils/duration";
import { Badge } from "@/shared/ui/badge";
import type { TrackRowProps } from "../types/track-row.types";

export function TrackDetails({ item, isCurrent, onPlay }: TrackRowProps) {
  const t = useTranslations("playlist");
  return (
    <div className="min-w-0">
      {isCurrent && <Badge variant="secondary">{t("TXT_NOW_PLAYING")}</Badge>}
      <button
        className="block min-h-11 max-w-full text-left font-bold hover:underline focus-visible:outline-2 disabled:no-underline"
        disabled={item.media.availability !== "AVAILABLE"}
        onClick={onPlay}
        type="button"
      >
        <span className="line-clamp-2">
          {item.media.title || t("TXT_UNKNOWN_TRACK")}
        </span>
      </button>
      <TrackMetadata item={item} />
    </div>
  );
}

function TrackMetadata({ item }: Pick<TrackRowProps, "item">) {
  const t = useTranslations("playlist");
  return (
    <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs">
      <span>{item.media.channelName || t("TXT_UNKNOWN_CHANNEL")}</span>
      {item.media.durationSeconds !== null && (
        <span>{formatDuration(item.media.durationSeconds)}</span>
      )}
      {item.media.availability !== "AVAILABLE" && (
        <Badge variant="destructive">{t("TXT_UNAVAILABLE")}</Badge>
      )}
    </div>
  );
}
