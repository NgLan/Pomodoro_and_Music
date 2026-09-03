import { Headphones, Music2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

const BARS = [40, 70, 50, 90, 62, 35, 78, 48, 85, 55, 30, 68];

export function MusicPreview() {
  const translate = useTranslations("pomodoro");
  return (
    <Card className="bg-accent-purple/70 relative overflow-hidden lg:min-h-[34rem]">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <span className="bg-surface border-border shadow-neo grid size-12 place-items-center rounded-xl border-2"><Headphones aria-hidden="true" className="size-6" /></span>
          <Badge className="border-border bg-accent-yellow border-2">{translate("TXT_MUSIC_BADGE")}</Badge>
        </div>
        <CardTitle className="pt-5 text-2xl">{translate("TXT_MUSIC_TITLE")}</CardTitle>
        <CardDescription className="text-foreground/70 text-base leading-relaxed">{translate("TXT_MUSIC_DESCRIPTION")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-end gap-5">
        <div className="border-border bg-surface/80 rounded-xl border-2 p-4">
          <div className="mb-3 flex items-center gap-3"><span className="bg-secondary border-border grid size-12 place-items-center rounded-lg border-2"><Music2 aria-hidden="true" /></span><div><strong className="block text-sm">{translate("TXT_AMBIENCE")}</strong><span className="text-muted-foreground text-xs">Cappucino Radio</span></div></div>
          <div className="flex h-10 items-end gap-1" aria-hidden="true">
            {BARS.map((height, index) => <span className="bg-accent-pink flex-1 rounded-t-sm opacity-70" key={index} style={{ height: `${height}%` }} />)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
