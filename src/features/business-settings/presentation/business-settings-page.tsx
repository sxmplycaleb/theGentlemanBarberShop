import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/page-header";
import { BusinessSettingsForm } from "@/features/business-settings/presentation/business-settings-form";
import type {
  BusinessSettings,
  BusinessSettingsAction,
} from "@/features/business-settings/types/business-settings.types";

interface BusinessSettingsPageProps {
  readonly action: BusinessSettingsAction;
  readonly isInitialized: boolean;
  readonly settings: BusinessSettings;
}

export function BusinessSettingsPage({
  action,
  isInitialized,
  settings,
}: BusinessSettingsPageProps) {
  return (
    <AuthenticatedPageShell
      description="Configure the business details used throughout daily operations."
      title="Business settings"
    >
      <section className="grid max-w-3xl gap-5">
        <SectionHeader
          description="Manage the business name, local timezone, and operating currency."
          title="Business details"
        />
        <Card>
          <CardContent>
            <BusinessSettingsForm
              action={action}
              isInitialized={isInitialized}
              settings={settings}
            />
          </CardContent>
        </Card>
      </section>
    </AuthenticatedPageShell>
  );
}
