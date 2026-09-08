import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { usePlayer } from "../providers/PlayerProvider";
import { PlayerControls } from "./PlayerControls";
import { PlayerProgressBar } from "./PlayerProgressBar";
import { PlayerStatus } from "./PlayerStatus";

interface PlayerDockDetailsProps {
  onMinimize: () => void;
}

export function PlayerDockDetails({ onMinimize }: PlayerDockDetailsProps) {
  const { state, current } = usePlayer();
  const t = useTranslations("musicPlayer");

  return (
    <div className="min-w-0 flex flex-col justify-between gap-1.5">
      <DockHeader onMinimize={onMinimize} />
      <p className="truncate font-bold text-sm sm:text-base leading-snug">
        {current?.title || state.playlist?.name || t("TXT_LOADING")}
      </p>
      <PlayerControls />
      <PlayerProgressBar />
      <PlayerStatus />
      <ReloadPlayerButton />
    </div>
  );
}

function DockHeader({ onMinimize }: { onMinimize: () => void }) {
  const t = useTranslations("musicPlayer");
  return (
    <div className="flex items-center justify-between gap-2">
      <Link
        href={routes.HOME}
        className="text-muted-foreground hover:text-text text-xs font-bold underline"
      >
        {t("BTN_BACK_TIMER")}
      </Link>
      <Button
        size="icon"
        variant="ghost"
        aria-label={t("BTN_MINIMIZE")}
        onClick={onMinimize}
        className="size-7 border-2 border-border shadow-[2px_2px_0_var(--color-border)] hover:bg-surface-blue"
      >
        <ChevronDown className="size-3.5" />
      </Button>
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
