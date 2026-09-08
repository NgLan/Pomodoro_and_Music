import { Pause, Play, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { usePlayer } from "../providers/PlayerProvider";
import { PlayerVolumeHover } from "./PlayerVolumeHover";
import { RepeatModeButton } from "./RepeatModeButton";

export function PlayerControls() {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
      <ShuffleButton />
      <StepButton direction={-1} />
      <PlayButton />
      <StepButton direction={1} />
      <RepeatModeButton />
      <PlayerVolumeHover />
    </div>
  );
}

function ShuffleButton() {
  const { state, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  return (
    <Button
      size="icon"
      variant={state.isShuffleEnabled ? "secondary" : "ghost"}
      className="size-9 sm:size-10 [&_svg]:size-4.5 sm:[&_svg]:size-5"
      aria-label={t("BTN_SHUFFLE")}
      aria-pressed={state.isShuffleEnabled}
      onClick={store.toggleShuffle}
    >
      <Shuffle />
    </Button>
  );
}

function StepButton({ direction }: { direction: -1 | 1 }) {
  const { current, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  return (
    <Button
      size="icon"
      variant="ghost"
      className="size-9 sm:size-10 [&_svg]:size-4.5 sm:[&_svg]:size-5"
      disabled={!current}
      aria-label={t(direction === 1 ? "BTN_NEXT" : "BTN_PREVIOUS")}
      onClick={() => store.step(direction)}
    >
      {direction === 1 ? <SkipForward /> : <SkipBack />}
    </Button>
  );
}

function PlayButton() {
  const { current, state, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  return (
    <Button
      size="icon"
      className="shadow-neo size-12 rounded-full sm:size-14 [&_svg]:size-6 sm:[&_svg]:size-7"
      disabled={!current}
      aria-label={t(state.isPlaying ? "BTN_PAUSE" : "BTN_PLAY")}
      onClick={store.toggle}
    >
      {state.isPlaying ? <Pause /> : <Play />}
    </Button>
  );
}
