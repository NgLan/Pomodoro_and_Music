"use client";

import { useRef, useState } from "react";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Slider } from "@/shared/ui/slider";
import { usePlayer } from "../providers/PlayerProvider";

function useVolumeFlyout(volume: number, onUpdate: (val: number) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastVol = useRef(volume || 60);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleOpen = () => {
    if (timer.current) clearTimeout(timer.current);
    setIsOpen(true);
  };
  const handleClose = () => {
    if (isDragging) return;
    timer.current = setTimeout(() => setIsOpen(false), 200);
  };
  const toggleMute = () => {
    if (volume > 0) {
      lastVol.current = volume;
      onUpdate(0);
    } else {
      onUpdate(lastVol.current || 60);
    }
  };
  return { isOpen, handleOpen, handleClose, toggleMute, setIsDragging };
}

export function PlayerVolumeHover() {
  const { state, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  const onUpdate = (val: number) => store.update((s) => ({ ...s, volume: val }));
  const { isOpen, handleOpen, handleClose, toggleMute, setIsDragging } =
    useVolumeFlyout(state.volume, onUpdate);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      <Button
        size="icon"
        variant="ghost"
        aria-label={t(state.volume === 0 ? "BTN_UNMUTE" : "BTN_MUTE")}
        onClick={toggleMute}
      >
        <VolumeIcon volume={state.volume} />
      </Button>
      {isOpen && (
        <VolumeFlyout
          volume={state.volume}
          onDragChange={setIsDragging}
          onValueChange={onUpdate}
        />
      )}
    </div>
  );
}

function VolumeIcon({ volume }: { volume: number }) {
  if (volume === 0) return <VolumeX className="size-4 text-muted-foreground" />;
  if (volume < 50) return <Volume1 className="size-4" />;
  return <Volume2 className="size-4" />;
}

interface FlyoutProps {
  volume: number;
  onDragChange: (dragging: boolean) => void;
  onValueChange: (value: number) => void;
}

function VolumeFlyout({ volume, onDragChange, onValueChange }: FlyoutProps) {
  const t = useTranslations("musicPlayer");
  return (
    <div
      role="tooltip"
      className="bg-surface border-border absolute bottom-full left-1/2 z-50 mb-2 flex w-12 -translate-x-1/2 flex-col items-center gap-2.5 rounded-xl border-2 p-2.5 shadow-[3px_3px_0_var(--color-border)]"
      onPointerDown={() => onDragChange(true)}
      onPointerUp={() => onDragChange(false)}
    >
      <span className="bg-surface-blue border-border text-text rounded border px-1 py-0.5 font-mono text-[11px] font-bold">
        {volume}%
      </span>
      <div className="h-[120px] w-6 flex items-center justify-center py-1">
        <Slider
          orientation="vertical"
          aria-label={t("VOLUME_LABEL")}
          value={[volume]}
          max={100}
          step={1}
          className="h-full"
          onValueChange={([val]) => onValueChange(val ?? 60)}
          onPointerUp={() => onDragChange(false)}
        />
      </div>
    </div>
  );
}
