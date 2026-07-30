import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BusinessSettingsForm } from "@/features/business-settings/presentation/business-settings-form";
import type { BusinessSettingsAction } from "@/features/business-settings/types/business-settings.types";

const settings = {
  business_name: "The Gentleman",
  currency_code: "KES",
  timezone: "Africa/Nairobi",
};

describe("BusinessSettingsForm", () => {
  it("renders approved select options and existing values", () => {
    const action = vi.fn(async () => ({
      success: true,
    })) as BusinessSettingsAction;

    render(
      <BusinessSettingsForm
        action={action}
        isInitialized
        settings={settings}
      />,
    );

    expect(screen.getByLabelText("Business name")).toHaveValue("The Gentleman");
    expect(screen.getByLabelText("Timezone")).toHaveValue("Africa/Nairobi");
    expect(screen.getByLabelText("Currency")).toHaveValue("KES");
    expect(
      screen.getByRole("option", { name: "Africa/Dar_es_Salaam" }),
    ).toBeVisible();
    expect(screen.getByRole("option", { name: "Asia/Dubai" })).toBeVisible();
    expect(screen.getByRole("option", { name: "GBP" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Save settings" })).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Back to account" }),
    ).toHaveAttribute("href", "/account");
  });

  it("announces missing-row defaults", () => {
    const action = vi.fn(async () => ({
      success: true,
    })) as BusinessSettingsAction;

    render(
      <BusinessSettingsForm
        action={action}
        isInitialized={false}
        settings={settings}
      />,
    );

    expect(screen.getByText(/No saved settings were found/)).toBeVisible();
  });

  it("renders structured action errors accessibly", async () => {
    const action = vi.fn(async () => ({
      errors: {
        business_name: ["Enter a business name."],
      },
      message: "Check the highlighted fields.",
      success: false,
    })) as BusinessSettingsAction;

    render(
      <BusinessSettingsForm
        action={action}
        isInitialized
        settings={settings}
      />,
    );

    fireEvent.submit(
      screen.getByRole("button", { name: "Save settings" }).closest("form")!,
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Check the highlighted fields.",
      );
    });
    expect(screen.getByText("Enter a business name.")).toHaveAttribute(
      "id",
      "business_name-error",
    );
    expect(screen.getByLabelText("Business name")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
