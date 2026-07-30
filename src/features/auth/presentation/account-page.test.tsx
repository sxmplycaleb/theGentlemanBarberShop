import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="user-button" />,
}));

import { AccountPage } from "@/features/auth/presentation/account-page";

describe("AccountPage", () => {
  it("renders the authenticated account status without business data", () => {
    render(<AccountPage userId="user_123" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Account" }),
    ).toBeVisible();
    expect(screen.getByText("Signed in")).toBeVisible();
    expect(screen.getByText("Services")).toBeVisible();
    expect(screen.getByText("Staff")).toBeVisible();
    expect(screen.getByText("Business settings")).toBeVisible();
    expect(screen.getAllByRole("link", { name: "Open" })[0]).toHaveAttribute(
      "href",
      "/account/services",
    );
    expect(screen.getAllByRole("link", { name: "Open" })[1]).toHaveAttribute(
      "href",
      "/account/staff",
    );
    expect(screen.getAllByRole("link", { name: "Open" })[2]).toHaveAttribute(
      "href",
      "/account/settings",
    );
    expect(screen.getByText(/user_123/)).toBeVisible();
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });
});
