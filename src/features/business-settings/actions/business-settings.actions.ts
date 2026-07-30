"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { saveBusinessSettings } from "@/features/business-settings/data/business-settings.repository";
import type { BusinessSettingsActionState } from "@/features/business-settings/types/business-settings.types";
import { businessSettingsFormSchema } from "@/features/business-settings/validation/business-settings.schema";

export async function saveBusinessSettingsAction(
  _previousState: BusinessSettingsActionState,
  formData: FormData,
): Promise<BusinessSettingsActionState> {
  await auth.protect();

  const parsed = businessSettingsFormSchema.safeParse({
    business_name: formData.get("business_name"),
    currency_code: formData.get("currency_code"),
    timezone: formData.get("timezone"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Check the highlighted fields.",
      success: false,
    };
  }

  try {
    await saveBusinessSettings(parsed.data);
  } catch {
    return {
      message: "Business settings could not be saved. Please try again.",
      success: false,
    };
  }

  revalidatePath("/account/settings");

  return {
    message: "Business settings saved.",
    success: true,
  };
}
