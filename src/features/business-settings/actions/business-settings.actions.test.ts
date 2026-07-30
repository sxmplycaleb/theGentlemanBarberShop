import { beforeEach, describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

const { revalidatePath } = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}));

const { saveBusinessSettings } = vi.hoisted(() => ({
  saveBusinessSettings: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: { protect },
}));

vi.mock("next/cache", () => ({
  revalidatePath,
}));

vi.mock(
  "@/features/business-settings/data/business-settings.repository",
  () => ({
    saveBusinessSettings,
  }),
);

import { saveBusinessSettingsAction } from "@/features/business-settings/actions/business-settings.actions";
import type { BusinessSettingsActionState } from "@/features/business-settings/types/business-settings.types";

const initialState: BusinessSettingsActionState = { success: false };

function createFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const values = {
    business_name: "  The Gentleman  ",
    currency_code: "kes",
    timezone: "Africa/Nairobi",
    ...overrides,
  };

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

describe("saveBusinessSettingsAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    protect.mockResolvedValue({ userId: "user_123" });
  });

  it("protects, validates, saves, and revalidates", async () => {
    const result = await saveBusinessSettingsAction(
      initialState,
      createFormData(),
    );

    expect(protect).toHaveBeenCalledOnce();
    expect(saveBusinessSettings).toHaveBeenCalledWith({
      business_name: "The Gentleman",
      currency_code: "KES",
      timezone: "Africa/Nairobi",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/account/settings");
    expect(result).toEqual({
      message: "Business settings saved.",
      success: true,
    });
  });

  it("returns structured validation errors without writing", async () => {
    const formData = createFormData({
      business_name: "",
      currency_code: "CAD",
      timezone: "Invalid/Timezone",
    });
    formData.set("id", "false");

    const result = await saveBusinessSettingsAction(initialState, formData);

    expect(saveBusinessSettings).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.errors?.business_name).toBeDefined();
    expect(result.errors?.currency_code).toBeDefined();
    expect(result.errors?.timezone).toBeDefined();
  });

  it("returns a safe failure when the repository rejects", async () => {
    saveBusinessSettings.mockRejectedValueOnce(
      new Error("sensitive database detail"),
    );

    const result = await saveBusinessSettingsAction(
      initialState,
      createFormData(),
    );

    expect(result).toEqual({
      message: "Business settings could not be saved. Please try again.",
      success: false,
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("stops before reading input when Clerk protection fails", async () => {
    protect.mockRejectedValueOnce(new Error("Unauthenticated"));
    const formData = createFormData();
    const get = vi.spyOn(formData, "get");

    await expect(
      saveBusinessSettingsAction(initialState, formData),
    ).rejects.toThrow("Unauthenticated");

    expect(get).not.toHaveBeenCalled();
    expect(saveBusinessSettings).not.toHaveBeenCalled();
  });
});
