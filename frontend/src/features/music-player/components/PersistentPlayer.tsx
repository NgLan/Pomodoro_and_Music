"use client";

import { useState, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { usePlayer } from "../providers/PlayerProvider";
import { useYoutubePlayer } from "../hooks/use-youtube-player";
import { PlayerDockDetails } from "./PlayerDockDetails";
import { PlayerMiniBar } from "./PlayerMiniBar";

export function PersistentPlayer() {
  const { state } = usePlayer();
  if (!state.playlistId) return null;
  return <PlayerDock />;
}

function PlayerDock() {
  const [isMinimized, setIsMinimized] = useState(true);
  const { store, state } = usePlayer();
  const host = useYoutubePlayer(store, state.providerRevision);
  const t = useTranslations("musicPlayer");

  return (
    <aside
      aria-label={t("TXT_TITLE")}
      className="border-border bg-surface shadow-neo sticky bottom-0 z-(--z-sticky) border-t-3"
    >
      <PlayerDockContent
        host={host}
        isMinimized={isMinimized}
        onMinimizedChange={setIsMinimized}
      />
    </aside>
  );
}

interface PlayerDockContentProps {
  host: RefObject<HTMLDivElement | null>;
  isMinimized: boolean;
  onMinimizedChange: (isMinimized: boolean) => void;
}

function PlayerDockContent({
  host,
  isMinimized,
  onMinimizedChange,
}: PlayerDockContentProps) {
  const layout = isMinimized
    ? "mx-auto max-w-7xl relative"
    : "mx-auto flex max-w-5xl flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4";
  return (
    <div className={layout}>
      <PlayerVideoHost host={host} isMinimized={isMinimized} />
      {isMinimized ? (
        <PlayerMiniBar onExpand={() => onMinimizedChange(false)} />
      ) : (
        <div className="min-w-0 flex-1">
          <PlayerDockDetails onMinimize={() => onMinimizedChange(true)} />
        </div>
      )}
    </div>
  );
}

function PlayerVideoHost({
  host,
  isMinimized,
}: Pick<PlayerDockContentProps, "host" | "isMinimized">) {
  const visibility = isMinimized
    ? "sr-only pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
    : "border-border bg-black aspect-video w-full max-w-[256px] overflow-hidden rounded-lg border-2 shadow-[2px_2px_0_var(--color-border)] shrink-0 [&>iframe]:size-full [&>iframe]:block [&>div]:size-full";
  return <div ref={host} className={visibility} />;
}
