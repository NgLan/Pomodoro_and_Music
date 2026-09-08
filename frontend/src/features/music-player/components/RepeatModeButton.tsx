import { Repeat, Repeat1 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { usePlayer } from "../providers/PlayerProvider";

export function RepeatModeButton() {
  const { state, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  const isEnabled = state.isRepeat || state.isRepeatOne;
  const label = t(state.isRepeatOne ? "BTN_REPEAT_ONE" : "BTN_REPEAT");
  return (
    <Button
      type="button"
      size="icon"
      variant={isEnabled ? "secondary" : "ghost"}
      className="size-9 sm:size-10 [&_svg]:size-4.5 sm:[&_svg]:size-5"
      aria-label={label}
      title={label}
      aria-pressed={isEnabled}
      onClick={isEnabled ? store.toggleRepeatOne : store.toggleRepeat}
    >
      {state.isRepeatOne ? <Repeat1 /> : <Repeat />}
    </Button>
  );
}
