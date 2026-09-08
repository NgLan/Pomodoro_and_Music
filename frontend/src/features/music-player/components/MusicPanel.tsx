"use client";
import { Headphones } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { usePlayer } from "../providers/PlayerProvider";
import { NowPlaying } from "./NowPlaying";
import { PlayerControls } from "./PlayerControls";
import { PlayerStatus } from "./PlayerStatus";
import { PlaylistSelector } from "./PlaylistSelector";
import { QueueButton } from "./QueueButton";

export function MusicPanel() {
  return (
    <Card className="bg-surface-blue min-w-0 flex flex-col justify-between min-h-[32rem] sm:min-h-[34rem]">
      <MusicHeading />
      <MusicContent />
    </Card>
  );
}

function MusicHeading() {
  const t = useTranslations("musicPlayer");
  return (
    <CardHeader className="pb-0 pt-3 sm:pt-4 px-4 sm:px-5">
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-bold">
        <Headphones className="size-5" />
        {t("TXT_TITLE")}
      </CardTitle>
      <p className="text-muted-foreground text-xs sm:text-sm">{t("TXT_SUBTITLE")}</p>
    </CardHeader>
  );
}

function MusicContent() {
  const { state, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  return (
    <CardContent className="flex flex-1 flex-col justify-between gap-3 px-4 sm:px-5 pb-3.5 sm:pb-4.5">
      <div className="space-y-3 sm:space-y-3.5">
        <PlaylistSelector
          value={state.playlistId}
          onChange={store.activate}
          label={t("PLAYLIST_LABEL")}
        />
        <NowPlaying />
        <PlayerControls />
        <PlayerStatus />
      </div>
      <div className="space-y-2">
        <QueueButton />
        <p className="text-muted-foreground text-[0.68rem]">{t("TXT_OVERRIDE_HINT")}</p>
      </div>
    </CardContent>
  );
}
