import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="user-button" />,
}));

import { AccountPage } from "@/features/auth/presentation/account-page";

describe("AccountPage", () => {
  it("renders the operational dashboard without fabricated metrics", () => {
    render(<AccountPage userId="user_123" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Dashboard" }),
    ).toBeVisible();
    expect(screen.getByText("Signed in")).toBeVisible();
    expect(screen.getAllByText("Services").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Staff").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Customers").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bookings").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Appointments").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Payments").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Business settings").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open Payments" })).toHaveAttribute(
      "href",
      "/account/payments",
    );
    expect(
      screen.getByRole("link", { name: "Open Appointments" }),
    ).toHaveAttribute("href", "/account/appointments");
    expect(screen.getByRole("link", { name: "Open Bookings" })).toHaveAttribute(
      "href",
      "/account/bookings",
    );
    expect(screen.getByText(/user_123/)).toBeInTheDocument();
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });
});
