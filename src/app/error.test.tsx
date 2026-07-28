import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ErrorPage from "@/app/error";

describe("ErrorPage", () => {
  it("lets users retry a failed route segment", async () => {
    const reset = vi.fn();

    render(<ErrorPage reset={reset} />);

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(screen.getByRole("heading", { name: "Something went wrong" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
