import { useTranslations } from "next-intl";
import type { YoutubePlaylistPreviewItemDto } from "@/api";
import { PlaylistThumbnail } from "@/features/playlist/components/PlaylistThumbnail";
import { Checkbox } from "@/shared/ui/checkbox";
import { formatDuration } from "@/shared/utils/duration";

interface PreviewItemProps {
  item: YoutubePlaylistPreviewItemDto;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}
export function ImportPreviewItem({
  item,
  checked,
  disabled,
  onToggle,
}: PreviewItemProps) {
  const t = useTranslations("youtubeImport");
  const title = item.title || t("TXT_UNTITLED");
  return (
    <label className="border-border/15 hover:bg-surface-blue flex min-h-24 cursor-pointer items-center gap-3 border-b px-4 py-3 last:border-0 sm:gap-4">
      <Checkbox
        checked={checked}
        disabled={disabled || !item.selectable}
        onCheckedChange={onToggle}
        aria-label={t("TXT_SELECT_ITEM", { title })}
      />
      <PreviewItemDetails item={item} />
    </label>
  );
}

function PreviewItemDetails({ item }: { item: YoutubePlaylistPreviewItemDto }) {
  const t = useTranslations("youtubeImport");
  const title = item.title || t("TXT_UNTITLED");
  return (
    <>
      <PlaylistThumbnail
        alt=""
        src={item.thumbnailUrl}
        className="hidden w-24 shrink-0 overflow-hidden rounded-md sm:block"
      />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 font-bold">{title}</span>
        <span className="text-muted-foreground mt-1 block text-sm">
          {item.selectable ? item.channelName : t("TXT_UNAVAILABLE")}
        </span>
      </span>
      <PreviewItemDuration item={item} />
    </>
  );
}

function PreviewItemDuration({
  item,
}: {
  item: YoutubePlaylistPreviewItemDto;
}) {
  return (
    <>
      {item.durationSeconds != null && (
        <span className="text-muted-foreground text-xs tabular-nums">
          {formatDuration(item.durationSeconds)}
        </span>
      )}
    </>
  );
}
