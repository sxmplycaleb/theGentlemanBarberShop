"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import type {
  ActionState,
  ServiceCategoryRow,
} from "@/features/services/types/service-management.types";
import { SubmitButton } from "@/features/services/presentation/submit-button";

interface ServiceCategoryFormProps {
  readonly action: (
    previousState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  readonly category?: ServiceCategoryRow;
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

export function ServiceCategoryForm({
  action,
  category,
  submitLabel,
}: ServiceCategoryFormProps) {
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
        <span className="font-medium">Name</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={category?.name}
          name="name"
          required
        />
        <FieldError errors={state.errors?.name} />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Slug</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={category?.slug}
          name="slug"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          required
        />
        <FieldError errors={state.errors?.slug} />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Description</span>
        <textarea
          className="border-border bg-background min-h-28 rounded-sm border px-3 py-2"
          defaultValue={category?.description ?? ""}
          name="description"
        />
        <FieldError errors={state.errors?.description} />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Display order</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={category?.display_order ?? 0}
          min={0}
          name="display_order"
          required
          type="number"
        />
        <FieldError errors={state.errors?.display_order} />
      </label>

      <label className="flex items-center gap-3 text-sm">
        <input
          className="size-4"
          defaultChecked={category?.is_active ?? true}
          name="is_active"
          type="checkbox"
        />
        <span className="font-medium">Active</span>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Button asChild variant="outline">
          <Link href="/account/services">Back to services</Link>
        </Button>
      </div>
    </form>
  );
}
