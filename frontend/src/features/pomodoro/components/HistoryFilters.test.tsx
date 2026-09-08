import { expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/render";
import { HistoryFilters } from "./HistoryFilters";
import type { PomodoroConfigurationResponseDto } from "@/api";

const mockActiveConfig: PomodoroConfigurationResponseDto = {
  id: "cfg-active",
  name: "Học tiếng Nhật",
  focusDurationSeconds: 1500,
  shortBreakDurationSeconds: 300,
  longBreakDurationSeconds: 900,
  focusSessionsBeforeLongBreak: 4,
  focusPlaylistId: null,
  breakPlaylistId: null,
  isDefault: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const mockDeletedConfig: PomodoroConfigurationResponseDto = {
  id: "cfg-deleted",
  name: "Cấu hình cũ A",
  focusDurationSeconds: 1500,
  shortBreakDurationSeconds: 300,
  longBreakDurationSeconds: 900,
  focusSessionsBeforeLongBreak: 4,
  focusPlaylistId: null,
  breakPlaylistId: null,
  isDefault: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  deletedAt: "2026-01-02T00:00:00.000Z",
};

it("renders configurations including soft-deleted ones with deleted tag", async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();

  render(
    <HistoryFilters
      configurations={[mockActiveConfig, mockDeletedConfig]}
      value={{
        configurationId: "all",
        date: "all",
        status: "all",
      }}
      onChange={handleChange}
    />,
  );

  const selects = screen.getAllByRole("combobox");
  // Index 0: config filter, Index 1: status filter
  const configSelect = selects[0];
  expect(configSelect).toHaveTextContent("Tất cả cấu hình");

  await user.click(configSelect);

  expect(
    screen.getByRole("option", { name: "Học tiếng Nhật" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: "Cấu hình cũ A (Đã xóa)" }),
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole("option", { name: "Cấu hình cũ A (Đã xóa)" }),
  );

  expect(handleChange).toHaveBeenCalledWith({
    configurationId: "cfg-deleted",
    date: "all",
    status: "all",
  });
});
