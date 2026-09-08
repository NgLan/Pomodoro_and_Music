import { Coffee, Palmtree, Sparkles } from "lucide-react";
import type { PomodoroPhaseType } from "@/api";

export interface PhaseTheme {
  badgeClass: string;
  progressClass: string;
  icon: typeof Sparkles;
}

export function getPhaseTheme(phase: PomodoroPhaseType): PhaseTheme {
  if (phase === "SHORT_BREAK") {
    return {
      badgeClass: "bg-secondary text-secondary-foreground",
      progressClass: "bg-secondary",
      icon: Coffee,
    };
  }
  if (phase === "LONG_BREAK") {
    return {
      badgeClass: "bg-accent-purple text-foreground",
      progressClass: "bg-accent-purple",
      icon: Palmtree,
    };
  }
  return {
    badgeClass: "bg-accent-pink text-surface",
    progressClass: "bg-accent-pink",
    icon: Sparkles,
  };
}
