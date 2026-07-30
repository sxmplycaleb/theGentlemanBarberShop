"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import type {
  ActionState,
  ServiceCategoryRow,
  ServiceRow,
} from "@/features/services/types/service-management.types";
import { SubmitButton } from "@/features/services/presentation/submit-button";

interface ServiceFormProps {
  readonly action: (
    previousState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  readonly categories: readonly ServiceCategoryRow[];
  readonly service?: ServiceRow;
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

export function ServiceForm({
  action,
  categories,
  service,
  submitLabel,
}: ServiceFormProps) {
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
        <span className="font-medium">Category</span>
        <select
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={service?.category_id ?? ""}
          name="category_id"
          required
        >
          <option value="">Choose a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <FieldError errors={state.errors?.category_id} />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Name</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={service?.name}
          name="name"
          required
        />
        <FieldError errors={state.errors?.name} />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Slug</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={service?.slug}
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
          defaultValue={service?.description ?? ""}
          name="description"
        />
        <FieldError errors={state.errors?.description} />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="font-medium">Image URL</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={service?.image_url ?? ""}
          name="image_url"
          placeholder="https://example.com/service.jpg"
          type="url"
        />
        <FieldError errors={state.errors?.image_url} />
      </label>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Duration minutes</span>
          <input
            className="border-border bg-background min-h-11 rounded-sm border px-3"
            defaultValue={service?.duration_minutes ?? 30}
            min={1}
            name="duration_minutes"
            required
            type="number"
          />
          <FieldError errors={state.errors?.duration_minutes} />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium">Price cents</span>
          <input
            className="border-border bg-background min-h-11 rounded-sm border px-3"
            defaultValue={service?.price_cents ?? 0}
            min={0}
            name="price_cents"
            required
            type="number"
          />
          <FieldError errors={state.errors?.price_cents} />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium">Display order</span>
          <input
            className="border-border bg-background min-h-11 rounded-sm border px-3"
            defaultValue={service?.display_order ?? 0}
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
          defaultChecked={service?.is_active ?? true}
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
