"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Slider } from "@/shared/ui/slider";
import { formatDuration } from "@/shared/utils/duration";
import { usePlayer } from "../providers/PlayerProvider";

function usePlaybackProgress() {
  const { current, state, store } = usePlayer();
  const [seekingValue, setSeekingValue] = useState<number | null>(null);
  const duration = Math.max(state.duration || 0, current?.durationSeconds || 0);
  const position = Math.min(
    seekingValue ?? state.position,
    duration > 0 ? duration : Infinity,
  );
  const commitSeek = ([val]: number[]) => {
    if (typeof val === "number") store.seek(val);
    setSeekingValue(null);
  };
  return { current, duration, position, setSeekingValue, commitSeek };
}

export function PlayerProgressBar() {
  const t = useTranslations("musicPlayer");
  const { current, duration, position, setSeekingValue, commitSeek } =
    usePlaybackProgress();

  return (
    <div className="text-muted-foreground flex w-full items-center gap-2 font-mono text-xs">
      <span className="w-10 text-right tabular-nums">
        {formatTime(position)}
      </span>
      <Slider
        aria-label={t("TXT_SEEK_LABEL")}
        min={0}
        max={duration > 0 ? duration : 100}
        step={1}
        disabled={!current || duration <= 0}
        value={[position]}
        onValueChange={([val]) => setSeekingValue(val ?? 0)}
        onValueCommit={commitSeek}
        className="cursor-pointer"
      />
      <span className="w-10 text-left tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  try {
    return formatDuration(seconds);
  } catch {
    return "00:00";
  }
}
