import { Play } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { PlaylistSummaryResponseDto } from "@/api";
import { routes } from "@/shared/config/routes";
import { formatDuration } from "@/shared/utils/duration";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { PlaylistCardMenu } from "./PlaylistCardMenu";
import { PlaylistThumbnail } from "./PlaylistThumbnail";

export function PlaylistCard({
  playlist,
  onDelete,
  onDuplicate,
  onEdit,
}: {
  playlist: PlaylistSummaryResponseDto;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
}) {
  const translate = useTranslations("playlist");
  return (
    <Card className="neo-interactive group overflow-hidden py-0">
      <Link
        className="border-border relative block overflow-hidden border-b-3"
        href={routes.PLAYLIST_DETAIL(playlist.id)}
      >
        <PlaylistThumbnail
          alt={playlist.name}
          className="w-full transition-transform duration-200 group-hover:scale-[1.02]"
          src={playlist.thumbnailUrl}
        />
        <span className="bg-surface border-border absolute right-3 bottom-3 rounded-full border-2 px-2 py-1 text-xs font-bold">
          {translate("TXT_TRACK_COUNT", { count: playlist.itemCount })}
        </span>
      </Link>
      <CardContent className="space-y-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              className="hover:underline"
              href={routes.PLAYLIST_DETAIL(playlist.id)}
            >
              <h2 className="truncate text-xl">{playlist.name}</h2>
            </Link>
            <p className="text-muted-foreground mt-1 line-clamp-2 min-h-10 text-sm">
              {playlist.description || translate("TXT_NO_DESCRIPTION")}
            </p>
          </div>
          <PlaylistCardMenu
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onEdit={onEdit}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={
              playlist.sourceType === "YOUTUBE" ? "destructive" : "secondary"
            }
          >
            {translate(
              playlist.sourceType === "YOUTUBE"
                ? "TXT_SOURCE_YOUTUBE"
                : "TXT_SOURCE_MANUAL",
            )}
          </Badge>
          {playlist.totalDurationSeconds !== null && (
            <span className="text-muted-foreground text-xs">
              {formatDuration(playlist.totalDurationSeconds)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pb-5">
        <Button asChild className="w-full">
          <Link href={routes.PLAYLIST_DETAIL(playlist.id)}>
            <Play fill="currentColor" />
            {translate("BTN_OPEN_PLAYLIST")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
