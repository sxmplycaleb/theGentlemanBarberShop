import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("provides a route back to the foundation page", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: "Page not found" }));
    expect(screen.getByRole("link", { name: "Return home" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
