import { LoaderCircle, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MediaItemResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { PlaylistThumbnail } from "./PlaylistThumbnail";

export function YoutubeSearchResult({
  isAdding,
  onAdd,
  video,
}: {
  isAdding: boolean;
  onAdd: () => void;
  video: MediaItemResponseDto;
}) {
  const translate = useTranslations("playlist");
  return (
    <article className="border-border bg-surface grid grid-cols-[104px_minmax(0,1fr)] gap-3 rounded-xl border-2 p-3 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center">
      <PlaylistThumbnail
        alt=""
        className="w-full rounded-lg"
        src={video.thumbnailUrl}
      />
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm">
          {video.title || translate("TXT_UNKNOWN_TRACK")}
        </h3>
        <p className="text-muted-foreground mt-1 truncate text-xs">
          {video.channelName || translate("TXT_UNKNOWN_CHANNEL")}
        </p>
      </div>
      <Button
        className="col-span-2 sm:col-span-1"
        disabled={isAdding}
        onClick={onAdd}
        size="sm"
        variant="secondary"
      >
        {isAdding ? <LoaderCircle className="animate-spin" /> : <Plus />}
        {translate("BTN_ADD")}
      </Button>
    </article>
  );
}
