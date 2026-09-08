import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Slider } from "@/shared/ui/slider";
import { usePlayer } from "../providers/PlayerProvider";

export function PlayerControls() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <ModeButton mode="shuffle" />
        <StepButton direction={-1} />
        <PlayButton />
        <StepButton direction={1} />
        <ModeButton mode="repeat" />
      </div>
      <PlayerVolume />
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
      className="size-12 rounded-full"
      disabled={!current}
      aria-label={t(state.isPlaying ? "BTN_PAUSE" : "BTN_PLAY")}
      onClick={store.toggle}
    >
      {state.isPlaying ? <Pause /> : <Play />}
    </Button>
  );
}

function PlayerVolume() {
  const { state, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  return (
    <div className="flex items-center gap-3">
      <Volume2 className="size-4 shrink-0" />
      <Slider
        aria-label={t("VOLUME_LABEL")}
        value={[state.volume]}
        max={100}
        step={1}
        onValueChange={([volume]) =>
          store.update((value) => ({ ...value, volume: volume ?? 60 }))
        }
      />
    </div>
  );
}
