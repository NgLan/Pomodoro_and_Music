import { describe, expect, it } from "vitest";
import { Coffee, Palmtree, Sparkles } from "lucide-react";
import { getPhaseTheme } from "./phase-theme";

describe("getPhaseTheme", () => {
  it("returns pink theme with sparkles for FOCUS", () => {
    const theme = getPhaseTheme("FOCUS");
    expect(theme.badgeClass).toContain("bg-accent-pink");
    expect(theme.progressClass).toBe("bg-accent-pink");
    expect(theme.icon).toBe(Sparkles);
  });

  it("returns mint green theme with coffee for SHORT_BREAK", () => {
    const theme = getPhaseTheme("SHORT_BREAK");
    expect(theme.badgeClass).toContain("bg-secondary");
    expect(theme.progressClass).toBe("bg-secondary");
    expect(theme.icon).toBe(Coffee);
  });

  it("returns lavender purple theme with palmtree for LONG_BREAK", () => {
    const theme = getPhaseTheme("LONG_BREAK");
    expect(theme.badgeClass).toContain("bg-accent-purple");
    expect(theme.progressClass).toBe("bg-accent-purple");
    expect(theme.icon).toBe(Palmtree);
  });
});
