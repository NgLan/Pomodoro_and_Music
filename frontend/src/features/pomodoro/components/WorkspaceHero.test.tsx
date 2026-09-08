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

it("calculates focus duration accurately down to seconds including completed and ended early sessions", () => {
  render(<WorkspaceHero history={mockHistory} />);
  // 1500s + 600s = 2100s = 35 phút 0 giây
  expect(screen.getByText("35 phút 0 giây")).toBeInTheDocument();
});

it("formats seconds accurately when partial seconds are present", () => {
  const historyWithSeconds: PomodoroHistoryResponseDto[] = [
    ...mockHistory,
    {
      id: "h4",
      pomodoroId: "p1",
      configurationName: "Test",
      phaseType: "FOCUS",
      status: "ENDED_EARLY",
      plannedDurationSeconds: 1500,
      actualDurationSeconds: 45, // 45 seconds
      startedAt: today,
      endedAt: today,
    },
  ];
  render(<WorkspaceHero history={historyWithSeconds} />);
  // 2100s + 45s = 2145s = 35 phút 45 giây
  expect(screen.getByText("35 phút 45 giây")).toBeInTheDocument();
});
