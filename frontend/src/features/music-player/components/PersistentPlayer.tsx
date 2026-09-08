"use client";
import { useTranslations } from "next-intl";
import { usePlayer } from "../providers/PlayerProvider";
import { useYoutubePlayer } from "../hooks/use-youtube-player";
import { PlayerDockDetails } from "./PlayerDockDetails";

export function PersistentPlayer() {
  const { state } = usePlayer();
  if (!state.playlistId) return null;
  return <PlayerDock />;
}

function PlayerDock() {
  const { store, state } = usePlayer();
  const host = useYoutubePlayer(store, state.providerRevision);
  const t = useTranslations("musicPlayer");
  return (
    <aside
      aria-label={t("TXT_TITLE")}
      className="border-border bg-surface bottom-0 z-(--z-sticky) border-t-3 sm:sticky"
    >
      <div className="mx-auto grid max-w-5xl gap-4 p-4 sm:grid-cols-[356px_1fr]">
        <div
          ref={host}
          className="border-border min-h-[200px] overflow-hidden rounded-lg border-2"
        />
        <PlayerDockDetails />
      </div>
    </aside>
  );
}
