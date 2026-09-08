import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import type { TrackRowProps } from "../types/track-row.types";
import { TrackMenu } from "./TrackMenu";

export function TrackActions(props: TrackRowProps) {
  return (
    <>
      <TrackPlayButton {...props} />
      <TrackMenu
        isFirst={props.isFirst}
        isLast={props.isLast}
        onMove={props.onMove}
        onRemove={props.onRemove}
      />
    </>
  );
}

function TrackPlayButton({ item, isCurrent, onPlay }: TrackRowProps) {
  const t = useTranslations("playlist");
  return (
    <Button
      aria-label={t("ARIA_PLAY_TRACK", { title: item.media.title ?? "" })}
      className="hidden sm:inline-flex"
      disabled={item.media.availability !== "AVAILABLE"}
      onClick={onPlay}
      size="icon"
      variant={isCurrent ? "secondary" : "ghost"}
    >
      <Play fill={isCurrent ? "currentColor" : "none"} />
    </Button>
  );
}
