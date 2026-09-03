import { useTranslations } from "next-intl";
import type { MediaItemResponseDto } from "@/api";
import { PlaylistThumbnail } from "./PlaylistThumbnail";

export function ResolvedVideoPreview({
  video,
}: {
  video: MediaItemResponseDto;
}) {
  const translate = useTranslations("playlist");
  return (
    <div className="border-border bg-surface-blue grid grid-cols-[112px_1fr] gap-3 rounded-xl border-2 p-3">
      <PlaylistThumbnail
        alt=""
        className="w-full rounded-lg"
        src={video.thumbnailUrl}
      />
      <div className="min-w-0">
        <strong className="line-clamp-2 text-sm">
          {video.title || translate("TXT_UNKNOWN_TRACK")}
        </strong>
        <span className="text-muted-foreground mt-1 block truncate text-xs">
          {video.channelName || translate("TXT_UNKNOWN_CHANNEL")}
        </span>
      </div>
    </div>
  );
}
