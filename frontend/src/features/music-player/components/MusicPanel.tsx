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
    <Card className="bg-surface-blue min-w-0">
      <MusicHeading />
      <MusicContent />
    </Card>
  );
}

function MusicHeading() {
  const t = useTranslations("musicPlayer");
  return (
    <CardHeader className="pb-1 pt-2 sm:pt-3 px-3 sm:px-5">
      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
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
    <CardContent className="space-y-2 sm:space-y-2.5 px-3 sm:px-5 pb-3 sm:pb-4">
      <PlaylistSelector
        value={state.playlistId}
        onChange={store.activate}
        label={t("PLAYLIST_LABEL")}
      />
      <NowPlaying />
      <PlayerControls />
      <PlayerStatus />
      <QueueButton />
      <p className="text-muted-foreground text-xs">{t("TXT_OVERRIDE_HINT")}</p>
    </CardContent>
  );
}
