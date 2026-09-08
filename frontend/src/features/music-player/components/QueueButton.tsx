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
        className="w-full"
        variant="outline"
        disabled={!state.playlistId}
        onClick={() => setOpen(true)}
      >
        <ListMusic />
        {t("BTN_QUEUE", { count: state.queue.length })}
      </Button>
      <PlayerQueue open={open} onOpenChange={setOpen} />
    </>
  );
}
