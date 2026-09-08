import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { usePlayer } from "../providers/PlayerProvider";
import { PlayerVolumeHover } from "./PlayerVolumeHover";

export function PlayerControls() {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      <ModeButton mode="shuffle" />
      <StepButton direction={-1} />
      <PlayButton />
      <StepButton direction={1} />
      <ModeButton mode="repeat" />
      <PlayerVolumeHover />
    </div>
  );
}

function ModeButton({ mode }: { mode: "shuffle" | "repeat" }) {
  const { state, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  const isShuffle = mode === "shuffle";
  const pressed = isShuffle ? state.isShuffleEnabled : state.isRepeat;
  return (
    <Button
      size="icon"
      variant={pressed ? "secondary" : "ghost"}
      aria-label={t(isShuffle ? "BTN_SHUFFLE" : "BTN_REPEAT")}
      aria-pressed={pressed}
      onClick={isShuffle ? store.toggleShuffle : store.toggleRepeat}
    >
      {isShuffle ? <Shuffle /> : <Repeat />}
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
      className="size-10 sm:size-11 rounded-full"
      disabled={!current}
      aria-label={t(state.isPlaying ? "BTN_PAUSE" : "BTN_PLAY")}
      onClick={store.toggle}
    >
      {state.isPlaying ? <Pause /> : <Play />}
    </Button>
  );
}
