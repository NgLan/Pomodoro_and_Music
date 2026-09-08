import Link from "next/link";
import { useTranslations } from "next-intl";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { usePlayer } from "../providers/PlayerProvider";
import { PlayerControls } from "./PlayerControls";
import { PlayerStatus } from "./PlayerStatus";

export function PlayerDockDetails() {
  const { state, current } = usePlayer();
  const t = useTranslations("musicPlayer");

  return (
    <div className="min-w-0 space-y-2">
      <Link
        href={routes.HOME}
        className="text-muted-foreground text-xs font-bold underline"
      >
        {t("BTN_BACK_TIMER")}
      </Link>
      <p className="truncate font-bold">
        {current?.title || state.playlist?.name || t("TXT_LOADING")}
      </p>
      <PlayerControls />
      <PlayerStatus />
      <ReloadPlayerButton />
    </div>
  );
}

function ReloadPlayerButton() {
  const { state, store } = usePlayer();
  const t = useTranslations("musicPlayer");
  if (state.issue !== "MSG_PLAYER_ERROR") return null;
  return (
    <Button variant="link" onClick={store.retry}>
      {t("BTN_RELOAD_PLAYER")}
    </Button>
  );
}
