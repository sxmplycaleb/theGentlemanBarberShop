import { UserButton } from "@clerk/nextjs";
import { Settings2 } from "lucide-react";

import { APP_NAME } from "@/constants/app";
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
    <main className="bg-background text-foreground min-h-dvh">
      <div className="mx-auto grid min-h-dvh w-full max-w-3xl gap-8 px-6 py-8 sm:px-10 lg:px-12">
        <header className="border-border flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-4">
            <span className="border-border bg-card grid size-11 place-items-center border">
              <Settings2 aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-muted-foreground text-sm">{APP_NAME}</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold">
                Business settings
              </h1>
            </div>
          </div>
          <UserButton />
        </header>

        <section className="grid gap-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              Business details
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Manage the business name, local timezone, and operating currency.
            </p>
          </div>
          <div className="border-border bg-card border p-6">
            <BusinessSettingsForm
              action={action}
              isInitialized={isInitialized}
              settings={settings}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
