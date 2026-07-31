"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SubmitButton } from "@/components/management/submit-button";
import { Button } from "@/components/ui/button";
import type {
  ActionState,
  CustomerRow,
} from "@/features/customers/types/customer-management.types";

type CustomerFormCustomer = Pick<
  CustomerRow,
  "email" | "full_name" | "is_active" | "notes" | "phone_number"
>;

interface CustomerFormProps {
  readonly action: (
    previousState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  readonly customer?: CustomerFormCustomer;
  readonly submitLabel: string;
}

const initialState: ActionState = { success: false };

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

export function CustomerForm({
  action,
  customer,
  submitLabel,
}: CustomerFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  const describedBy = (name: string) =>
    state.errors?.[name] ? `${name}-error` : undefined;

  return (
    <form action={formAction} className="grid gap-5">
      {state.message ? (
        <p
          className="border-border bg-card rounded-sm border px-4 py-3 text-sm"
          role={state.success ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-2 text-sm">
        <label className="font-medium" htmlFor="full_name">
          Full name
        </label>
        <input
          aria-describedby={describedBy("full_name")}
          aria-invalid={Boolean(state.errors?.full_name)}
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={customer?.full_name}
          id="full_name"
          maxLength={120}
          name="full_name"
          required
        />
        <FieldError errors={state.errors?.full_name} id="full_name-error" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2 text-sm">
          <label className="font-medium" htmlFor="phone_number">
            Phone number
          </label>
          <input
            aria-describedby={describedBy("phone_number")}
            aria-invalid={Boolean(state.errors?.phone_number)}
            className="border-border bg-background min-h-11 rounded-sm border px-3"
            defaultValue={customer?.phone_number ?? ""}
            id="phone_number"
            maxLength={32}
            name="phone_number"
            type="tel"
          />
          <FieldError
            errors={state.errors?.phone_number}
            id="phone_number-error"
          />
        </div>

        <div className="grid gap-2 text-sm">
          <label className="font-medium" htmlFor="email">
            Email
          </label>
          <input
            aria-describedby={describedBy("email")}
            aria-invalid={Boolean(state.errors?.email)}
            className="border-border bg-background min-h-11 rounded-sm border px-3"
            defaultValue={customer?.email ?? ""}
            id="email"
            maxLength={254}
            name="email"
            type="email"
          />
          <FieldError errors={state.errors?.email} id="email-error" />
        </div>
      </div>

      <div className="grid gap-2 text-sm">
        <label className="font-medium" htmlFor="notes">
          Notes
        </label>
        <textarea
          aria-describedby={describedBy("notes")}
          aria-invalid={Boolean(state.errors?.notes)}
          className="border-border bg-background min-h-32 rounded-sm border px-3 py-2"
          defaultValue={customer?.notes ?? ""}
          id="notes"
          maxLength={2000}
          name="notes"
        />
        <FieldError errors={state.errors?.notes} id="notes-error" />
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          className="size-4"
          defaultChecked={customer?.is_active ?? true}
          name="is_active"
          type="checkbox"
        />
        <span className="font-medium">Active</span>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Button asChild variant="outline">
          <Link href="/account/customers">Back to customers</Link>
        </Button>
      </div>
    </form>
  );
}
