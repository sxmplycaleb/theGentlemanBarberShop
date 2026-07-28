import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth/presentation/auth-navigation", () => ({
  AuthNavigation: () => <nav aria-label="Authentication" />,
}));

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the foundation experience", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "The Gentleman BarberShop and Spa",
      }),
    ).toBeInTheDocument();
  });
});
