import { useTranslations } from "next-intl";
import { usePlayerRetry } from "../hooks/use-player-retry";
import { Button } from "@/shared/ui/button";
import { usePlayer } from "../providers/PlayerProvider";
import type { PlayerState } from "../types/player.types";

export function PlayerStatus() {
  const { state } = usePlayer();
  const t = useTranslations("musicPlayer");
  const retry = usePlayerRetry();
  return (
    <div role="status" className="text-muted-foreground text-sm">
      <p>{t(state.issue ?? statusKey(state))}</p>
      {state.issue && (
        <Button variant="link" onClick={() => void retry()}>
          {t("BTN_RETRY")}
        </Button>
      )}
    </div>
  );
}

function statusKey(state: PlayerState) {
  if (!state.playlistId) return "TXT_SILENT";
  if (!state.playlist) return "TXT_LOADING";
  if (!state.itemId) return "TXT_EMPTY";
  return state.isPlaying ? "TXT_PLAYING" : "TXT_PAUSED";
}
