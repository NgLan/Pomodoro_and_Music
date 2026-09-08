import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { usePlayer } from "@/features/music-player/providers/PlayerProvider";
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
  const { state, store } = usePlayer();
  const isPlayingCurrent = isCurrent && state.isPlaying;

  const handleClick = () => {
    if (isCurrent) store.toggle();
    else onPlay();
  };

  return (
    <Button
      aria-label={t(isPlayingCurrent ? "ARIA_PAUSE" : "ARIA_PLAY_TRACK", {
        title: item.media.title ?? "",
      })}
      className="hidden sm:inline-flex"
      disabled={item.media.availability !== "AVAILABLE"}
      onClick={handleClick}
      size="icon"
      variant={isCurrent ? "secondary" : "ghost"}
    >
      {isPlayingCurrent ? (
        <Pause className="size-4" />
      ) : (
        <Play fill={isCurrent ? "currentColor" : "none"} />
      )}
    </Button>
  );
}
