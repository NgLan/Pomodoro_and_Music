import { ArrowLeft, Edit3, Play, Repeat2, Shuffle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { PlaylistDetailResponseDto } from "@/api";
import { routes } from "@/shared/config/routes";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { PlaylistThumbnail } from "./PlaylistThumbnail";

export function PlaylistDetailHero({
  isRepeat,
  isShuffled,
  playlist,
  onEdit,
  onPlay,
  onRepeat,
  onShuffle,
}: {
  isRepeat: boolean;
  isShuffled: boolean;
  playlist: PlaylistDetailResponseDto;
  onEdit: () => void;
  onPlay: () => void;
  onRepeat: () => void;
  onShuffle: () => void;
}) {
  const translate = useTranslations("playlist");
  const isEmpty = playlist.items.length === 0;
  return (
    <section className="neo-surface bg-accent-purple overflow-hidden p-5 sm:p-8">
      <Link
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold hover:underline"
        href={routes.PLAYLISTS}
      >
        <ArrowLeft className="size-4" />
        {translate("BTN_BACK_LIBRARY")}
      </Link>
      <div className="grid items-center gap-6 md:grid-cols-[minmax(220px,360px)_1fr]">
        <div className="border-border shadow-neo-lg overflow-hidden rounded-xl border-3">
          <PlaylistThumbnail
            alt={playlist.name}
            className="w-full"
            src={playlist.thumbnailUrl}
          />
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
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
            <Badge variant="outline">
              {translate("TXT_TRACK_COUNT", { count: playlist.items.length })}
            </Badge>
          </div>
          <div>
            <h1 className="text-3xl sm:text-5xl">{playlist.name}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {playlist.description || translate("TXT_NO_DESCRIPTION")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button disabled={isEmpty} onClick={onPlay} size="lg">
              <Play fill="currentColor" />
              {translate("BTN_PLAY")}
            </Button>
            <Button
              aria-pressed={isShuffled}
              disabled={isEmpty}
              onClick={onShuffle}
              variant={isShuffled ? "secondary" : "outline"}
            >
              <Shuffle />
              {translate("BTN_SHUFFLE")}
            </Button>
            <Button
              aria-pressed={isRepeat}
              disabled={isEmpty}
              onClick={onRepeat}
              variant={isRepeat ? "secondary" : "outline"}
            >
              <Repeat2 />
              {translate("BTN_REPEAT")}
            </Button>
            <Button onClick={onEdit} variant="outline">
              <Edit3 />
              {translate("BTN_EDIT")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
