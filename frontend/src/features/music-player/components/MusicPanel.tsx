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
    <CardHeader className="pb-0 pt-1 sm:pt-1.5 px-3 sm:px-4">
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
        <Headphones className="size-4.5" />
        {t("TXT_TITLE")}
      </CardTitle>
      <p className="text-muted-foreground text-xs">{t("TXT_SUBTITLE")}</p>
    </CardHeader>
  );
}

function MusicContent() {
  const { state, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  return (
    <CardContent className="space-y-1.5 sm:space-y-2 px-3 sm:px-4 pb-2 sm:pb-2.5">
      <PlaylistSelector
        value={state.playlistId}
        onChange={store.activate}
        label={t("PLAYLIST_LABEL")}
      />
      <NowPlaying />
      <PlayerControls />
      <PlayerStatus />
      <QueueButton />
      <p className="text-muted-foreground text-[0.68rem]">{t("TXT_OVERRIDE_HINT")}</p>
    </CardContent>
  );
}
