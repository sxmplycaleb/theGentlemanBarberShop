import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { BusinessSettings } from "@/features/business-settings/types/business-settings.types";
import type { BusinessSettingsFormValues } from "@/features/business-settings/validation/business-settings.schema";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const businessSettingsColumns = "business_name,currency_code,timezone";

function getBusinessSettingsClient() {
  return createSupabaseServerClient({ serviceRole: true });
}

async function selectBusinessSettings(
  supabase: SupabaseClient<Database>,
): Promise<BusinessSettings | null> {
  const { data, error } = await supabase
    .from("business_settings")
    .select(businessSettingsColumns)
    .eq("id", true)
    .maybeSingle();

  if (error) {
    throw new Error("Business settings could not be loaded.");
  }

  return data;
}

export async function getBusinessSettings(): Promise<BusinessSettings | null> {
  return selectBusinessSettings(getBusinessSettingsClient());
}

export async function saveBusinessSettings(
  values: BusinessSettingsFormValues,
): Promise<BusinessSettings> {
  const supabase = getBusinessSettingsClient();
  const { data, error } = await supabase
    .from("business_settings")
    .upsert({ id: true, ...values }, { onConflict: "id" })
    .select(businessSettingsColumns)
    .single();

  if (error || !data) {
    throw new Error("Business settings could not be saved.");
  }

  return data;
}
