import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { TrackList } from "@/features/playlist/components/TrackList";
import { usePlaylistDetailController } from "@/features/playlist/hooks/use-playlist-detail-controller";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/ui/sheet";
import { usePlayer } from "../providers/PlayerProvider";

export function PlayerQueue({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state } = usePlayer();
  const t = useTranslations("musicPlayer");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        closeLabel={t("BTN_CLOSE")}
        side="bottom"
        className="max-h-[85svh] w-full overflow-y-auto rounded-t-2xl sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-h-none sm:max-w-2xl sm:rounded-none"
      >
        <SheetHeader>
          <SheetTitle>{state.playlist?.name ?? t("TXT_TITLE")}</SheetTitle>
          <SheetDescription>{t("TXT_QUEUE_HINT")}</SheetDescription>
        </SheetHeader>
        {state.playlistId && <QueueTracks id={state.playlistId} />}
      </SheetContent>
    </Sheet>
  );
}

function QueueTracks({ id }: { id: string }) {
  const router = useRouter();
  const controller = usePlaylistDetailController(id);
  const t = useTranslations("musicPlayer");
  return (
    <div className="space-y-4 px-4 pb-6">
      <Button asChild variant="outline">
        <Link href={routes.PLAYLIST_DETAIL(id)}>{t("BTN_OPEN_PLAYLIST")}</Link>
      </Button>
      {controller.query.data && (
        <TrackList
          current={controller.playback.current}
          items={controller.query.data.items}
          onPlay={controller.playback.select}
          onRemove={controller.remove}
          onMove={controller.move}
          onOpenSearch={() => router.push(routes.PLAYLIST_DETAIL(id))}
        />
      )}
    </div>
  );
}
