import { useTranslations } from "next-intl";
import { PlaylistThumbnail } from "@/features/playlist/components/PlaylistThumbnail";
import { usePlayer } from "../providers/PlayerProvider";

export function NowPlaying() {
  const { current } = usePlayer();
  const t = useTranslations("musicPlayer");
  return (
    <div className="border-border bg-surface flex items-center gap-2 rounded-xl border-2 p-1.5 sm:p-2">
      <PlaylistThumbnail
        src={current?.thumbnailUrl ?? null}
        alt=""
        className="aspect-square size-11 sm:size-12 shrink-0 rounded-lg"
      />
      <div className="min-w-0">
        <p className="line-clamp-1 font-bold text-xs sm:text-sm">
          {current?.title || t("TXT_READY")}
        </p>
        <p className="text-muted-foreground truncate text-[0.68rem] sm:text-xs">
          {current?.channelName || t("TXT_YOUR_SPACE")}
        </p>
      </div>
    </div>
  );
}
