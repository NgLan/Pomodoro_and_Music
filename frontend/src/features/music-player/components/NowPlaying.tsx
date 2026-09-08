import { useTranslations } from "next-intl";
import { PlaylistThumbnail } from "@/features/playlist/components/PlaylistThumbnail";
import { usePlayer } from "../providers/PlayerProvider";

export function NowPlaying() {
  const { current } = usePlayer();
  const t = useTranslations("musicPlayer");
  return (
    <div className="border-border bg-surface shadow-neo-sm flex items-center gap-3 rounded-xl border-2 p-2.5 sm:p-3">
      <PlaylistThumbnail
        src={current?.thumbnailUrl ?? null}
        alt=""
        className="aspect-square size-14 shrink-0 rounded-lg sm:size-16"
      />
      <div className="min-w-0">
        <p className="line-clamp-1 text-sm font-bold sm:text-base">
          {current?.title || t("TXT_READY")}
        </p>
        <p className="text-muted-foreground mt-0.5 truncate text-xs sm:text-sm">
          {current?.channelName || t("TXT_YOUR_SPACE")}
        </p>
      </div>
    </div>
  );
}
