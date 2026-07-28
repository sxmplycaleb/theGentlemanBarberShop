import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("is hidden from assistive technology", () => {
    render(<Skeleton data-testid="loading-block" />);

    expect(screen.getByTestId("loading-block")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
