import { describe, expect, it } from "vitest";
import { getCurrentRound, getNextPhase } from "./pomodoro-machine";

describe("getCurrentRound", () => {
  it("keeps the same round during break and only increments after break completes", () => {
    // Round 1: Focus
    expect(getCurrentRound(0, 4, "FOCUS")).toBe(1);
    // Round 1: Break (1 focus completed, currently resting)
    expect(getCurrentRound(1, 4, "SHORT_BREAK")).toBe(1);

    // Round 2: Focus (user starts 2nd focus)
    expect(getCurrentRound(1, 4, "FOCUS")).toBe(2);
    // Round 2: Break (2 focus completed, currently resting)
    expect(getCurrentRound(2, 4, "SHORT_BREAK")).toBe(2);

    // Round 3: Focus & Break
    expect(getCurrentRound(2, 4, "FOCUS")).toBe(3);
    expect(getCurrentRound(3, 4, "SHORT_BREAK")).toBe(3);

    // Round 4: Focus & Long Break
    expect(getCurrentRound(3, 4, "FOCUS")).toBe(4);
    expect(getCurrentRound(4, 4, "LONG_BREAK")).toBe(4);

    // Next cycle: Round 1 Focus & Break
    expect(getCurrentRound(4, 4, "FOCUS")).toBe(1);
    expect(getCurrentRound(5, 4, "SHORT_BREAK")).toBe(1);
  });

  it("handles edge case when completedFocusSessions is 0 on break", () => {
    expect(getCurrentRound(0, 4, "SHORT_BREAK")).toBe(1);
  });
});

describe("getNextPhase", () => {
  it("transitions sequentially through focus and breaks", () => {
    // Start of session: Focus -> Short Break
    const t1 = getNextPhase("FOCUS", 0, 4);
    expect(t1.completedFocusSessions).toBe(1);
    expect(t1.nextPhase).toBe("SHORT_BREAK");

    // Short Break -> Focus (round 2)
    const t2 = getNextPhase("SHORT_BREAK", t1.completedFocusSessions, 4);
    expect(t2.completedFocusSessions).toBe(1);
    expect(t2.nextPhase).toBe("FOCUS");

    // Focus 4 -> Long Break
    const t3 = getNextPhase("FOCUS", 3, 4);
    expect(t3.completedFocusSessions).toBe(4);
    expect(t3.nextPhase).toBe("LONG_BREAK");

    // Long Break -> Focus
    const t4 = getNextPhase("LONG_BREAK", t3.completedFocusSessions, 4);
    expect(t4.completedFocusSessions).toBe(4);
    expect(t4.nextPhase).toBe("FOCUS");
  });
});
