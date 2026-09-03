import type { PomodoroPhaseType } from "@/api";

export function phaseTranslationKey(phase: PomodoroPhaseType) {
  if (phase === "SHORT_BREAK") return "TXT_SHORT_BREAK" as const;
  if (phase === "LONG_BREAK") return "TXT_LONG_BREAK" as const;
  return "TXT_FOCUS" as const;
}
