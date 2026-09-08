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
    <Card className="bg-surface-blue flex min-h-[32rem] min-w-0 flex-col justify-between sm:min-h-[34rem]">
      <MusicHeading />
      <MusicContent />
    </Card>
  );
}

function MusicHeading() {
  const t = useTranslations("musicPlayer");
  return (
    <CardHeader className="px-4 pt-3 pb-0 sm:px-5 sm:pt-4">
      <CardTitle className="flex items-center gap-2 text-base font-bold sm:text-lg">
        <Headphones className="size-5" />
        {t("TXT_TITLE")}
      </CardTitle>
      <p className="text-muted-foreground text-xs sm:text-sm">
        {t("TXT_SUBTITLE")}
      </p>
    </CardHeader>
  );
}

function MusicContent() {
  const { state, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  return (
    <CardContent className="flex flex-1 flex-col justify-between gap-3 px-4 pb-3.5 sm:px-5 sm:pb-4.5">
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
        <p className="text-muted-foreground text-[0.68rem]">
          {t("TXT_OVERRIDE_HINT")}
        </p>
      </div>
    </CardContent>
  );
}
