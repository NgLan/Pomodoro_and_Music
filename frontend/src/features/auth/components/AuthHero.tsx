import { Coffee } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";

const BARS = [32, 55, 40, 75, 48, 90, 62, 38, 68, 45];

export function AuthHero() {
  const translate = useTranslations("auth");
  return (
    <section className="space-y-6 px-2 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <span className="border-border bg-primary shadow-neo grid size-14 -rotate-3 place-items-center rounded-2xl border-3">
          <Coffee aria-hidden="true" className="size-8" />
        </span>
        <LanguageSwitcher />
      </div>
      <div>
        <p className="text-accent-pink text-sm font-extrabold tracking-wider uppercase">Cappucino</p>
        <h1 className="mt-3 text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] tracking-[-0.05em]">
          {translate("TXT_WELCOME_TITLE")}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed">{translate("TXT_WELCOME_DESCRIPTION")}</p>
      </div>
      <div className="hidden items-end gap-1 lg:flex" aria-hidden="true">
        {BARS.map((height, index) => (
          <span className="bg-accent-pink border-border w-4 rounded-t-md border-2" key={index} style={{ height }} />
        ))}
      </div>
    </section>
  );
}
