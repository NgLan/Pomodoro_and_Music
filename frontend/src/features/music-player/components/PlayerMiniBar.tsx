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
    <div className="flex items-center justify-between gap-2 px-3 py-1 sm:gap-4 sm:px-4 sm:py-1.5">
      <MiniTrackInfo />
      <div className="shrink-0">
        <PlayerControls />
      </div>
      <div className="hidden max-w-xl min-w-[140px] flex-1 sm:block">
        <PlayerProgressBar />
      </div>
      <div className="flex shrink-0 items-center">
        <Button
          size="icon"
          variant="ghost"
          aria-label={t("BTN_EXPAND")}
          onClick={onExpand}
          className="border-border hover:bg-surface-blue size-8 border-2 shadow-[2px_2px_0_var(--color-border)]"
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
    <div className="flex max-w-[180px] min-w-0 shrink-0 items-center gap-2 sm:max-w-xs">
      {current?.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current.thumbnailUrl}
          alt=""
          className="border-border size-8 shrink-0 rounded border-2 object-cover sm:size-9"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs leading-tight font-bold sm:text-sm">
          {title}
        </p>
        {current?.channelName && (
          <p className="text-muted-foreground truncate text-[0.68rem] leading-tight sm:text-xs">
            {current.channelName}
          </p>
        )}
      </div>
    </div>
  );
}
