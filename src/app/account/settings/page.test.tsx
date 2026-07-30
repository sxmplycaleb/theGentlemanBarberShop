import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

const { getBusinessSettings } = vi.hoisted(() => ({
  getBusinessSettings: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: { protect },
}));

vi.mock(
  "@/features/business-settings/actions/business-settings.actions",
  () => ({
    saveBusinessSettingsAction: vi.fn(),
  }),
);

vi.mock(
  "@/features/business-settings/data/business-settings.repository",
  () => ({
    getBusinessSettings,
  }),
);

vi.mock(
  "@/features/business-settings/presentation/business-settings-page",
  () => ({
    BusinessSettingsPage: (props: {
      readonly isInitialized: boolean;
      readonly settings: unknown;
    }) => <main data-testid="business-settings-page" {...props} />,
  }),
);

import Page from "@/app/account/settings/page";

describe("business settings route", () => {
  it("protects and loads existing business settings", async () => {
    const settings = {
      business_name: "The Gentleman",
      currency_code: "KES",
      timezone: "Africa/Nairobi",
    };
    protect.mockResolvedValueOnce({ userId: "user_123" });
    getBusinessSettings.mockResolvedValueOnce(settings);

    const element = await Page();

    expect(protect).toHaveBeenCalledOnce();
    expect(getBusinessSettings).toHaveBeenCalledOnce();
    expect(element.props.isInitialized).toBe(true);
    expect(element.props.settings).toBe(settings);
  });

  it("uses approved defaults when the singleton is missing", async () => {
    protect.mockResolvedValueOnce({ userId: "user_123" });
    getBusinessSettings.mockResolvedValueOnce(null);

    const element = await Page();

    expect(element.props.isInitialized).toBe(false);
    expect(element.props.settings).toEqual({
      business_name: "The Gentleman BarberShop and Spa",
      currency_code: "KES",
      timezone: "Africa/Nairobi",
    });
  });
});
