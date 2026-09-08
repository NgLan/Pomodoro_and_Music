import { ListMusic } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { usePlayer } from "../providers/PlayerProvider";
import { PlayerQueue } from "./PlayerQueue";

export function QueueButton() {
  const { state } = usePlayer();
  const [open, setOpen] = useState(false);
  const t = useTranslations("musicPlayer");
  return (
    <>
      <Button
        className="shadow-neo-sm h-11 w-full text-sm font-bold sm:h-12 sm:text-base"
        variant="outline"
        disabled={!state.playlistId}
        onClick={() => setOpen(true)}
      >
        <ListMusic className="size-5" />
        {t("BTN_QUEUE", { count: state.queue.length })}
      </Button>
      <PlayerQueue open={open} onOpenChange={setOpen} />
    </>
  );
}
