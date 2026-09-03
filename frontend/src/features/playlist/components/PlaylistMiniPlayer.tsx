import { Pause, SkipBack, SkipForward } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MediaItemResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { PageContainer } from "@/shared/ui/layout/AppShell";
import { PlaylistThumbnail } from "./PlaylistThumbnail";

export function PlaylistMiniPlayer({
  current,
  onNext,
  onPause,
  onPrevious,
}: {
  current: MediaItemResponseDto;
  onNext: () => void;
  onPause: () => void;
  onPrevious: () => void;
}) {
  const translate = useTranslations("playlist");
  return (
    <PageContainer className="flex items-center gap-3 py-3 lg:py-3">
      <PlaylistThumbnail
        alt=""
        className="w-16 rounded-lg"
        src={current.thumbnailUrl}
      />
      <div className="min-w-0 flex-1">
        <span className="text-accent-pink text-xs font-bold">
          {translate("TXT_NOW_PLAYING")}
        </span>
        <strong className="block truncate text-sm">
          {current.title || translate("TXT_UNKNOWN_TRACK")}
        </strong>
        <span className="text-muted-foreground block truncate text-xs">
          {current.channelName || translate("TXT_UNKNOWN_CHANNEL")}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          aria-label={translate("ARIA_PREVIOUS")}
          onClick={onPrevious}
          size="icon-sm"
          variant="ghost"
        >
          <SkipBack />
        </Button>
        <Button
          aria-label={translate("ARIA_PAUSE")}
          onClick={onPause}
          size="icon"
          variant="secondary"
        >
          <Pause />
        </Button>
        <Button
          aria-label={translate("ARIA_NEXT")}
          onClick={onNext}
          size="icon-sm"
          variant="ghost"
        >
          <SkipForward />
        </Button>
      </div>
    </PageContainer>
  );
}
