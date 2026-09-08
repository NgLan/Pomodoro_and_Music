import { expect, it } from "vitest";
import { render, screen } from "@/test/render";
import { WorkspaceHero } from "./WorkspaceHero";
import type { PomodoroHistoryResponseDto } from "@/api";

const today = new Date().toISOString();

const mockHistory: PomodoroHistoryResponseDto[] = [
  {
    id: "h1",
    pomodoroId: "p1",
    configurationName: "Test",
    phaseType: "FOCUS",
    status: "COMPLETED",
    plannedDurationSeconds: 1500,
    actualDurationSeconds: 1500, // 25 min
    startedAt: today,
    endedAt: today,
  },
  {
    id: "h2",
    pomodoroId: "p1",
    configurationName: "Test",
    phaseType: "FOCUS",
    status: "ENDED_EARLY",
    plannedDurationSeconds: 1500,
    actualDurationSeconds: 600, // 10 min
    startedAt: today,
    endedAt: today,
  },
  {
    id: "h3",
    pomodoroId: "p1",
    configurationName: "Test",
    phaseType: "SHORT_BREAK",
    status: "COMPLETED",
    plannedDurationSeconds: 300,
    actualDurationSeconds: 300, // Break time should not be counted
    startedAt: today,
    endedAt: today,
  },
];

it("calculates focus minutes including completed and ended early sessions but not breaks", () => {
  render(<WorkspaceHero history={mockHistory} />);
  // 1500s + 600s = 2100s = 35 minutes
  expect(screen.getByText("35 phút")).toBeInTheDocument();
});
