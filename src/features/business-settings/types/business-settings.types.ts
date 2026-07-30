import type { Database } from "@/lib/supabase/database.types";

type BusinessSettingsRow =
  Database["public"]["Tables"]["business_settings"]["Row"];

export type BusinessSettings = Pick<
  BusinessSettingsRow,
  "business_name" | "currency_code" | "timezone"
>;

export type BusinessSettingsActionState = {
  readonly errors?: Record<string, readonly string[]>;
  readonly message?: string;
  readonly success: boolean;
};

export type BusinessSettingsAction = (
  previousState: BusinessSettingsActionState,
  formData: FormData,
) => Promise<BusinessSettingsActionState>;
