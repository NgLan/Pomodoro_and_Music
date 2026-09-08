import { afterEach, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { cleanup, render, screen } from "@/test/render";
import { ImportUrlForm } from "./ImportUrlForm";
import { ImportConfirmation } from "./ImportConfirmation";

afterEach(cleanup);
it("rejects a video-only URL inline and preserves input", async () => {
  const user = userEvent.setup();
  const onPreview = vi.fn();
  render(
    <ImportUrlForm disabled={false} isLoading={false} onPreview={onPreview} />,
  );
  const input = screen.getByRole("textbox");
  await user.type(input, "https://youtube.com/watch?v=123456");
  await user.click(screen.getByRole("button", { name: "Xem trước" }));
  expect(screen.getByRole("alert")).toBeVisible();
  expect(input).toHaveValue("https://youtube.com/watch?v=123456");
  expect(onPreview).not.toHaveBeenCalled();
  await user.type(input, "&list=PLtest");
  await user.click(screen.getByRole("button", { name: "Xem trước" }));
  expect(onPreview).toHaveBeenCalledWith(
    "https://youtube.com/watch?v=123456&list=PLtest",
  );
});

it("prevents empty selection and duplicate submission while pending", () => {
  const props = {
    count: 0,
    name: "Focus",
    isPending: false,
    onName: vi.fn(),
    onImport: vi.fn(),
  };
  const view = render(<ImportConfirmation {...props} />);
  expect(screen.getByRole("button")).toBeDisabled();
  view.rerender(<ImportConfirmation {...props} count={4} isPending />);
  expect(screen.getByRole("button")).toBeDisabled();
  expect(screen.getByRole("status")).toHaveTextContent("4 video");
});
