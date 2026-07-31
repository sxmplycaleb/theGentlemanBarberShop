"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SubmitButton } from "@/components/management/submit-button";
import { Button } from "@/components/ui/button";
import {
  BUSINESS_CURRENCY_CODES,
  BUSINESS_TIMEZONES,
} from "@/features/business-settings/constants/business-settings.constants";
import type {
  BusinessSettings,
  BusinessSettingsAction,
  BusinessSettingsActionState,
} from "@/features/business-settings/types/business-settings.types";

interface BusinessSettingsFormProps {
  readonly action: BusinessSettingsAction;
  readonly isInitialized: boolean;
  readonly settings: BusinessSettings;
}

const initialState: BusinessSettingsActionState = {
  success: false,
};

function FieldError({
  errors,
  id,
}: {
  readonly errors: readonly string[] | undefined;
  readonly id: string;
}) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p className="text-danger text-sm font-medium" id={id}>
      {errors[0]}
    </p>
  );
}

export function BusinessSettingsForm({
  action,
  isInitialized,
  settings,
}: BusinessSettingsFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      {!isInitialized ? (
        <p className="border-border bg-muted rounded-sm border px-4 py-3 text-sm">
          No saved settings were found. These defaults will be created when you
          save.
        </p>
      ) : null}

      {state.message ? (
        <p
          className="border-border bg-card rounded-sm border px-4 py-3 text-sm"
          role={state.success ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-2 text-sm">
        <label className="font-medium" htmlFor="business_name">
          Business name
        </label>
        <input
          aria-describedby={
            state.errors?.business_name ? "business_name-error" : undefined
          }
          aria-invalid={Boolean(state.errors?.business_name)}
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={settings.business_name}
          id="business_name"
          maxLength={120}
          name="business_name"
          required
        />
        <FieldError
          errors={state.errors?.business_name}
          id="business_name-error"
        />
      </div>

      <div className="grid gap-2 text-sm">
        <label className="font-medium" htmlFor="timezone">
          Timezone
        </label>
        <select
          aria-describedby={
            state.errors?.timezone
              ? "timezone-help timezone-error"
              : "timezone-help"
          }
          aria-invalid={Boolean(state.errors?.timezone)}
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={settings.timezone}
          id="timezone"
          name="timezone"
          required
        >
          {BUSINESS_TIMEZONES.map((timezone) => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </select>
        <p className="text-muted-foreground text-xs" id="timezone-help">
          Used for business-local dates and times.
        </p>
        <FieldError errors={state.errors?.timezone} id="timezone-error" />
      </div>

      <div className="grid gap-2 text-sm">
        <label className="font-medium" htmlFor="currency_code">
          Currency
        </label>
        <select
          aria-describedby={
            state.errors?.currency_code ? "currency_code-error" : undefined
          }
          aria-invalid={Boolean(state.errors?.currency_code)}
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={settings.currency_code}
          id="currency_code"
          name="currency_code"
          required
        >
          {BUSINESS_CURRENCY_CODES.map((currencyCode) => (
            <option key={currencyCode} value={currencyCode}>
              {currencyCode}
            </option>
          ))}
        </select>
        <FieldError
          errors={state.errors?.currency_code}
          id="currency_code-error"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButton>Save settings</SubmitButton>
        <Button asChild variant="outline">
          <Link href="/account">Back to account</Link>
        </Button>
      </div>
    </form>
  );
}
