import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Loading from "@/app/loading";

describe("Loading", () => {
  it("marks the page as busy while foundation content loads", () => {
    render(<Loading />);

    expect(screen.getByRole("main", { name: "Loading" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });
});
