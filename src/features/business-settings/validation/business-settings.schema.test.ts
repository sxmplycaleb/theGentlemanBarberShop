import { describe, expect, it } from "vitest";

import { businessSettingsFormSchema } from "@/features/business-settings/validation/business-settings.schema";

describe("businessSettingsFormSchema", () => {
  it("normalizes valid business settings", () => {
    expect(
      businessSettingsFormSchema.parse({
        business_name: "  The Gentleman  ",
        currency_code: " kes ",
        timezone: " Africa/Nairobi ",
      }),
    ).toEqual({
      business_name: "The Gentleman",
      currency_code: "KES",
      timezone: "Africa/Nairobi",
    });
  });

  it("accepts every supported timezone and currency", () => {
    const timezones = [
      "Africa/Nairobi",
      "UTC",
      "Africa/Kampala",
      "Africa/Dar_es_Salaam",
      "Africa/Addis_Ababa",
      "Europe/London",
      "Europe/Paris",
      "America/New_York",
      "America/Los_Angeles",
      "Asia/Dubai",
    ];

    for (const timezone of timezones) {
      expect(
        businessSettingsFormSchema.safeParse({
          business_name: "The Gentleman",
          currency_code: "USD",
          timezone,
        }).success,
      ).toBe(true);
    }
  });

  it("rejects blank names and unsupported select values", () => {
    const result = businessSettingsFormSchema.safeParse({
      business_name: " ",
      currency_code: "CAD",
      timezone: "Africa/Invalid",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.business_name).toBeDefined();
      expect(errors.currency_code).toBeDefined();
      expect(errors.timezone).toBeDefined();
    }
  });
});
