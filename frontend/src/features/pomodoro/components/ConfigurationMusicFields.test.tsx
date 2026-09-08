import { afterEach, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { useForm, useWatch } from "react-hook-form";
import { cleanup, render, screen } from "@/test/render";
import { Form } from "@/shared/ui/form";
import { ConfigurationMusicFields } from "./ConfigurationMusicFields";
import type { ConfigurationFormValues } from "../types/pomodoro-ui.types";

const mockQuery = vi.fn();

vi.mock("@/features/playlist/hooks/use-playlist-library-query", () => ({
  usePlaylistLibraryQuery: () => mockQuery(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function TestValue({
  control,
}: {
  control: ReturnType<typeof useForm<ConfigurationFormValues>>["control"];
}) {
  const value = useWatch({ control, name: "focusPlaylistId" });
  return <span data-testid="focus-val">{String(value)}</span>;
}

function TestHarness() {
  const form = useForm<ConfigurationFormValues>({
    defaultValues: {
      focusPlaylistId: null,
      breakPlaylistId: null,
      name: "Default",
      focusDurationMinutes: 25,
      shortBreakDurationMinutes: 5,
      longBreakDurationMinutes: 15,
      focusSessionsBeforeLongBreak: 4,
    },
  });

  return (
    <Form {...form}>
      <ConfigurationMusicFields form={form} />
      <TestValue control={form.control} />
    </Form>
  );
}

it("allows selecting playlist for pomodoro focus music", async () => {
  const user = userEvent.setup();
  mockQuery.mockReturnValue({
    data: [{ id: "playlist-uuid-1", name: "Coding Chill" }],
    isLoading: false,
    isError: false,
  });

  render(<TestHarness />);

  expect(screen.getByTestId("focus-val")).toHaveTextContent("null");

  const combos = screen.getAllByRole("combobox");
  await user.click(combos[0]);

  const option = await screen.findByRole("option", { name: "Coding Chill" });
  await user.click(option);

  expect(screen.getByTestId("focus-val")).toHaveTextContent("playlist-uuid-1");
});
