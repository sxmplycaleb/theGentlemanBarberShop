import { z } from "zod";

import {
  BUSINESS_CURRENCY_CODES,
  BUSINESS_TIMEZONES,
} from "@/features/business-settings/constants/business-settings.constants";

export const businessSettingsFormSchema = z.object({
  business_name: z
    .string()
    .trim()
    .min(1, "Enter a business name.")
    .max(120, "Business name must be 120 characters or fewer."),
  currency_code: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .pipe(
      z.enum(BUSINESS_CURRENCY_CODES, {
        error: "Choose a supported currency.",
      }),
    ),
  timezone: z
    .string()
    .trim()
    .pipe(
      z.enum(BUSINESS_TIMEZONES, {
        error: "Choose a supported timezone.",
      }),
    ),
});

export type BusinessSettingsFormValues = z.infer<
  typeof businessSettingsFormSchema
>;
