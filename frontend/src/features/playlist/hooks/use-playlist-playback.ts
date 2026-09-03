"use client";

import { useMemo, useState } from "react";
import type { MediaItemResponseDto, PlaylistItemResponseDto } from "@/api";

export function usePlaylistPlayback(items: PlaylistItemResponseDto[]) {
  const available = useMemo(
    () => items.filter((item) => item.media.availability === "AVAILABLE"),
    [items],
  );
  const [current, setCurrent] = useState<MediaItemResponseDto | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const play = () => {
    if (!available.length) return;
    const index = isShuffled ? Math.floor(Math.random() * available.length) : 0;
    setCurrent(available[index]!.media);
  };
  const step = (offset: number) => {
    if (!available.length) return;
    const currentIndex = Math.max(0, findCurrent(available, current));
    const bounded = Math.min(
      available.length - 1,
      Math.max(0, currentIndex + offset),
    );
    const index = isRepeat
      ? (currentIndex + offset + available.length) % available.length
      : bounded;
    setCurrent(available[index]!.media);
  };
  const prepareRemoval = (itemId: string) => {
    const index = available.findIndex((item) => item.id === itemId);
    if (index < 0 || !sameMedia(available[index]!, current)) return;
    setCurrent(
      available[index + 1]?.media ?? available[index - 1]?.media ?? null,
    );
  };

  return {
    current,
    isRepeat,
    isShuffled,
    pause: () => setCurrent(null),
    play,
    prepareRemoval,
    select: setCurrent,
    step,
    toggleRepeat: () => setIsRepeat((value) => !value),
    toggleShuffle: () => setIsShuffled((value) => !value),
  };
}

function findCurrent(
  items: PlaylistItemResponseDto[],
  current: MediaItemResponseDto | null,
): number {
  return items.findIndex((item) => sameMedia(item, current));
}

function sameMedia(
  item: PlaylistItemResponseDto,
  media: MediaItemResponseDto | null,
): boolean {
  return item.media.externalMediaId === media?.externalMediaId;
}
