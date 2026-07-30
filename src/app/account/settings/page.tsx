import { auth } from "@clerk/nextjs/server";

import { saveBusinessSettingsAction } from "@/features/business-settings/actions/business-settings.actions";
import { DEFAULT_BUSINESS_SETTINGS } from "@/features/business-settings/constants/business-settings.constants";
import { getBusinessSettings } from "@/features/business-settings/data/business-settings.repository";
import { BusinessSettingsPage } from "@/features/business-settings/presentation/business-settings-page";

export default async function Page() {
  await auth.protect();

  const settings = await getBusinessSettings();

  return (
    <BusinessSettingsPage
      action={saveBusinessSettingsAction}
      isInitialized={settings !== null}
      settings={settings ?? DEFAULT_BUSINESS_SETTINGS}
    />
  );
}
