import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FoundationPage } from "@/features/foundation/presentation/foundation-page";

describe("FoundationPage", () => {
  it("renders the verified business name as the primary heading", () => {
    render(<FoundationPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "The Gentleman BarberShop and Spa",
      }),
    ).toBeInTheDocument();
  });

  it("presents the foundation status as structured data", () => {
    render(<FoundationPage />);

    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByText("Foundation")).toBeInTheDocument();
    expect(screen.getByText("Environment")).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });
});
