import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PlaylistSummaryResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

export function DeletePlaylistDialog({
  playlist,
  isPending,
  onCancel,
  onConfirm,
}: {
  playlist: PlaylistSummaryResponseDto | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const translate = useTranslations("playlist");
  return (
    <Dialog
      open={Boolean(playlist)}
      onOpenChange={(open) => !open && onCancel()}
    >
      <DialogContent closeLabel={translate("ARIA_CLOSE")}>
        <DialogHeader>
          <DialogTitle>
            {translate("TXT_DELETE_TITLE", { name: playlist?.name ?? "" })}
          </DialogTitle>
          <DialogDescription>
            {translate(
              playlist?.sourceType === "YOUTUBE"
                ? "TXT_DELETE_YOUTUBE_DESCRIPTION"
                : "TXT_DELETE_DESCRIPTION",
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {translate("BTN_CANCEL")}
          </Button>
          <Button
            disabled={isPending}
            variant="destructive"
            onClick={() => void onConfirm()}
          >
            <Trash2 />
            {translate("BTN_CONFIRM_DELETE")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
