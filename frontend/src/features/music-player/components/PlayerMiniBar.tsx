"use client";

import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { usePlayer } from "../providers/PlayerProvider";
import { PlayerControls } from "./PlayerControls";
import { PlayerProgressBar } from "./PlayerProgressBar";

interface PlayerMiniBarProps {
  onExpand: () => void;
}

export function PlayerMiniBar({ onExpand }: PlayerMiniBarProps) {
  const t = useTranslations("musicPlayer");

  return (
    <div className="flex flex-col gap-2 p-2 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-2.5">
      <MiniTrackInfo />
      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 min-w-0">
        <PlayerControls />
        <PlayerProgressBar />
      </div>
      <div className="flex items-center justify-end shrink-0">
        <Button
          size="icon"
          variant="ghost"
          aria-label={t("BTN_EXPAND")}
          onClick={onExpand}
          className="border-2 border-border shadow-[2px_2px_0_var(--color-border)] hover:bg-surface-blue"
        >
          <ChevronUp className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function MiniTrackInfo() {
  const { state, current } = usePlayer();
  const t = useTranslations("musicPlayer");
  const title = current?.title || state.playlist?.name || t("TXT_LOADING");

  return (
    <div className="flex items-center gap-2.5 min-w-0 sm:w-60 shrink-0">
      {current?.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current.thumbnailUrl}
          alt=""
          className="size-10 rounded border-2 border-border object-cover shrink-0"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold leading-tight">{title}</p>
        {current?.channelName && (
          <p className="truncate text-xs text-muted-foreground leading-tight">
            {current.channelName}
          </p>
        )}
      </div>
    </div>
  );
}
