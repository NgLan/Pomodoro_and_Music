import { CheckCircle2, MoreHorizontal, Pencil, Play, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PomodoroConfigurationResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

export function ConfigurationCard({ configuration, index, selected, onDelete, onEdit, onSelect }: {
  configuration: PomodoroConfigurationResponseDto; index: number; selected: boolean;
  onDelete: () => void; onEdit: () => void; onSelect: () => void;
}) {
  const translate = useTranslations("pomodoro");
  const accents = ["bg-primary", "bg-secondary", "bg-accent-purple"];
  const phases = [
    ["TXT_FOCUS_DURATION", configuration.focusDurationSeconds],
    ["TXT_SHORT_BREAK_DURATION", configuration.shortBreakDurationSeconds],
    ["TXT_LONG_BREAK_DURATION", configuration.longBreakDurationSeconds],
  ] as const;
  return (
    <Card className="relative overflow-hidden">
      <span className={`${accents[index % accents.length]} border-border absolute inset-x-0 top-0 h-3 border-b-2`} />
      <CardHeader className="pt-5"><div className="flex items-start justify-between gap-3">
        <div><CardTitle className="text-xl">{configuration.name}</CardTitle><CardDescription className="mt-2">{configuration.focusDurationSeconds / 60}m · {configuration.focusSessionsBeforeLongBreak} {translate("TXT_SESSION_SHORT")}</CardDescription></div>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={translate("ARIA_CONFIG_MENU", { name: configuration.name })}><MoreHorizontal /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end"><DropdownMenuItem onSelect={onEdit}><Pencil />{translate("BTN_EDIT")}</DropdownMenuItem><DropdownMenuItem variant="destructive" onSelect={onDelete}><Trash2 />{translate("BTN_DELETE")}</DropdownMenuItem></DropdownMenuContent>
        </DropdownMenu>
      </div></CardHeader>
      <CardContent className="grid grid-cols-3 gap-2 text-center">{phases.map(([key, seconds]) => <div className="bg-muted rounded-lg p-2" key={key}><span className="text-muted-foreground block text-[0.68rem] font-bold">{translate(key)}</span><strong>{seconds / 60}m</strong></div>)}</CardContent>
      <div className="px-6 pb-1"><Button className="w-full" variant={selected ? "secondary" : "outline"} onClick={onSelect}>{selected ? <CheckCircle2 /> : <Play />}{translate(selected ? "BTN_SELECTED" : "BTN_USE_CONFIG")}</Button></div>
    </Card>
  );
}
