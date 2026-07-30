"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SubmitButton } from "@/components/management/submit-button";
import { Button } from "@/components/ui/button";
import type {
  ActionState,
  StaffRow,
} from "@/features/staff/types/staff-management.types";

interface StaffFormProps {
  readonly action: (
    previousState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  readonly staff?: StaffRow;
  readonly submitLabel: string;
}

const initialState: ActionState = {
  success: false,
};

function FieldError({
  errors,
}: {
  readonly errors: readonly string[] | undefined;
}) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-primary text-sm">{errors[0]}</p>;
}

export function StaffForm({ action, staff, submitLabel }: StaffFormProps) {
  const [state, formAction] = useActionState(action, initialState);

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

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Display name</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={staff?.display_name}
          name="display_name"
          required
        />
        <FieldError errors={state.errors?.display_name} />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Slug</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={staff?.slug}
          name="slug"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          required
        />
        <FieldError errors={state.errors?.slug} />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Bio</span>
        <textarea
          className="border-border bg-background min-h-28 rounded-sm border px-3 py-2"
          defaultValue={staff?.bio ?? ""}
          name="bio"
        />
        <FieldError errors={state.errors?.bio} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Phone number</span>
          <input
            className="border-border bg-background min-h-11 rounded-sm border px-3"
            defaultValue={staff?.phone_number ?? ""}
            name="phone_number"
            type="tel"
          />
          <FieldError errors={state.errors?.phone_number} />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium">Display order</span>
          <input
            className="border-border bg-background min-h-11 rounded-sm border px-3"
            defaultValue={staff?.display_order ?? 0}
            min={0}
            name="display_order"
            required
            type="number"
          />
          <FieldError errors={state.errors?.display_order} />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          className="size-4"
          defaultChecked={staff?.is_active ?? true}
          name="is_active"
          type="checkbox"
        />
        <span className="font-medium">Active</span>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Button asChild variant="outline">
          <Link href="/account/staff">Back to staff</Link>
        </Button>
      </div>
    </form>
  );
}
