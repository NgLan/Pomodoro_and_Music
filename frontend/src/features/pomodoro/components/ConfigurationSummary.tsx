import { Clock3, Coffee } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PomodoroConfigurationResponseDto } from "@/api";
import { Card, CardContent } from "@/shared/ui/card";

export function ConfigurationSummary({ configuration }: {
  configuration?: PomodoroConfigurationResponseDto;
}) {
  const translate = useTranslations("pomodoro");
  if (!configuration) return null;
  const items = [
    [translate("TXT_FOCUS_DURATION"), configuration.focusDurationSeconds / 60, "bg-primary"],
    [translate("TXT_SHORT_BREAK_DURATION"), configuration.shortBreakDurationSeconds / 60, "bg-secondary"],
    [translate("TXT_LONG_BREAK_DURATION"), configuration.longBreakDurationSeconds / 60, "bg-accent-purple"],
    [translate("TXT_LONG_BREAK_AFTER"), configuration.focusSessionsBeforeLongBreak, "bg-accent-yellow"],
  ] as const;
  return (
    <Card className="shadow-neo bg-surface py-5">
      <CardContent className="grid gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([label, value, color], index) => (
          <div className="flex items-center gap-3" key={label}>
            <span className={`${color} border-border grid size-10 place-items-center rounded-lg border-2`}>{index === 3 ? <Coffee className="size-4" /> : <Clock3 className="size-4" />}</span>
            <div><span className="text-muted-foreground block text-xs font-bold">{label}</span><strong>{value} {translate(index === 3 ? "TXT_SESSION_SHORT" : "TXT_MINUTES_SHORT")}</strong></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
