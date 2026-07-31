import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div aria-label="Mock user profile" />,
}));

import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";

describe("AuthenticatedPageShell", () => {
  it("renders navigation, breadcrumbs, profile, and content", () => {
    render(
      <AuthenticatedPageShell title="Dashboard">
        <p>Dashboard content</p>
      </AuthenticatedPageShell>,
    );

    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeVisible();
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeVisible();
    expect(screen.getByText("Dashboard content")).toBeVisible();
    expect(screen.getByLabelText("Mock user profile")).toBeVisible();
  });

  it("collapses the desktop sidebar and opens the mobile drawer", () => {
    render(
      <AuthenticatedPageShell title="Dashboard">
        <p>Dashboard content</p>
      </AuthenticatedPageShell>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(
      screen.getByRole("button", { name: "Expand sidebar" }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(screen.getByLabelText("Mobile navigation")).toBeVisible();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(
      screen.queryByLabelText("Mobile navigation"),
    ).not.toBeInTheDocument();
  });
});
