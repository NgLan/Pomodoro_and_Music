import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@/test/render";
import { InputPagination } from "./InputPagination";

describe("InputPagination", () => {
  it("moves to adjacent pages", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    const view = render(
      <InputPagination
        currentPage={2}
        totalPages={4}
        onPageChange={onPageChange}
      />,
    );

    await user.click(
      within(view.container).getByRole("button", { name: "Sang trang trước" }),
    );
    await user.click(
      within(view.container).getByRole("button", { name: "Sang trang sau" }),
    );

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it("accepts a directly entered page number", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    const view = render(
      <InputPagination
        currentPage={2}
        totalPages={4}
        onPageChange={onPageChange}
      />,
    );
    const input = within(view.container).getByRole("spinbutton", {
      name: "Số trang",
    });

    await user.clear(input);
    await user.type(input, "3{Enter}");

    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(input).toHaveValue(3);
  });

  it("shows a single page with both directions disabled", () => {
    const view = render(
      <InputPagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    );
    const pagination = within(view.container);

    expect(
      pagination.getByRole("spinbutton", { name: "Số trang" }),
    ).toHaveValue(1);
    expect(
      pagination.getByRole("button", { name: "Sang trang trước" }),
    ).toBeDisabled();
    expect(
      pagination.getByRole("button", { name: "Sang trang sau" }),
    ).toBeDisabled();
  });
});
