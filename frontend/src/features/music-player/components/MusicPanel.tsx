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
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-xl">
        <Headphones />
        {t("TXT_TITLE")}
      </CardTitle>
      <p className="text-muted-foreground text-sm">{t("TXT_SUBTITLE")}</p>
    </CardHeader>
  );
}

function MusicContent() {
  const { state, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  return (
    <CardContent className="space-y-5">
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
