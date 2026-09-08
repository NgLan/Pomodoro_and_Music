import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface TimerResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function TimerResetDialog({
  open,
  onOpenChange,
  onConfirm,
}: TimerResetDialogProps) {
  const t = useTranslations("pomodoro");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t("ARIA_CLOSE")}>
        <DialogHeader>
          <DialogTitle>{t("TXT_RESET_CYCLE_TITLE")}</DialogTitle>
          <DialogDescription>
            {t("TXT_RESET_CYCLE_DESCRIPTION")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("BTN_CANCEL")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("BTN_CONFIRM_RESET")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
