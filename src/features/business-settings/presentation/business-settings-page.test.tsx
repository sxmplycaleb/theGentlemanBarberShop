import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="user-button" />,
}));

vi.mock(
  "@/features/business-settings/presentation/business-settings-form",
  () => ({
    BusinessSettingsForm: () => <form aria-label="Business settings form" />,
  }),
);

import { BusinessSettingsPage } from "@/features/business-settings/presentation/business-settings-page";
import type { BusinessSettingsAction } from "@/features/business-settings/types/business-settings.types";

describe("BusinessSettingsPage", () => {
  it("renders the management shell and introductory content", () => {
    const action = vi.fn(async () => ({
      success: true,
    })) as BusinessSettingsAction;

    render(
      <BusinessSettingsPage
        action={action}
        isInitialized
        settings={{
          business_name: "The Gentleman",
          currency_code: "KES",
          timezone: "Africa/Nairobi",
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Business settings" }),
    ).toBeVisible();
    expect(
      screen.getByText(/Manage the business name, local timezone/),
    ).toBeVisible();
    expect(
      screen.getByRole("form", { name: "Business settings form" }),
    ).toBeVisible();
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });
});
