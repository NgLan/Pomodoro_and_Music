import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";

export function TimerStopDialog({ open, onOpenChange, onStop }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStop: () => void;
}) {
  const translate = useTranslations("pomodoro");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={translate("ARIA_CLOSE")}>
        <DialogHeader>
          <DialogTitle>{translate("TXT_STOP_TITLE")}</DialogTitle>
          <DialogDescription>{translate("TXT_STOP_DESCRIPTION")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{translate("BTN_CANCEL")}</Button>
          <Button variant="destructive" onClick={onStop}>{translate("BTN_CONFIRM_STOP")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
