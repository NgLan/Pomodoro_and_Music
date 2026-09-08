import { expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/render";
import { TimerConfigSelector } from "./TimerConfigSelector";
import type { PomodoroConfigurationResponseDto } from "@/api";

const mockConfig: PomodoroConfigurationResponseDto = {
  id: "cfg-1",
  name: "Học Nihongo",
  focusDurationSeconds: 1500, // 25 min
  shortBreakDurationSeconds: 300,
  longBreakDurationSeconds: 900,
  focusSessionsBeforeLongBreak: 4, // 25 * 4 = 100 min
  focusPlaylistId: null,
  breakPlaylistId: null,
  isDefault: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

it("renders configuration name and handles edit", async () => {
  const user = userEvent.setup();
  const handleEdit = vi.fn();
  const handleSelect = vi.fn();

  render(
    <TimerConfigSelector
      configurations={[mockConfig]}
      selected={mockConfig}
      onSelect={handleSelect}
      onEdit={handleEdit}
    />,
  );

  expect(screen.getByRole("combobox")).toHaveTextContent("Học Nihongo");

  const editBtn = screen.getByRole("button", { name: "Chỉnh sửa cấu hình này" });
  await user.click(editBtn);

  expect(handleEdit).toHaveBeenCalledWith(mockConfig);
});
