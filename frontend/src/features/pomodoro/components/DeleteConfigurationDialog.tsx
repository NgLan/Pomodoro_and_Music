import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PomodoroConfigurationResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";

export function DeleteConfigurationDialog({ value, onCancel, onConfirm }: {
  value: PomodoroConfigurationResponseDto | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const translate = useTranslations("pomodoro");
  return (
    <Dialog open={Boolean(value)} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent closeLabel={translate("ARIA_CLOSE")}>
        <DialogHeader><DialogTitle>{translate("TXT_DELETE_TITLE", { name: value?.name ?? "" })}</DialogTitle><DialogDescription>{translate("TXT_DELETE_DESCRIPTION")}</DialogDescription></DialogHeader>
        <DialogFooter><Button variant="outline" onClick={onCancel}>{translate("BTN_CANCEL")}</Button><Button variant="destructive" onClick={onConfirm}><Trash2 />{translate("BTN_CONFIRM_DELETE")}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
