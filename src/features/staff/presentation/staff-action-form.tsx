"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import type { ActionState } from "@/features/staff/types/staff-management.types";

interface StaffActionFormProps {
  readonly action: (
    previousState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  readonly children: React.ReactNode;
  readonly fields: readonly {
    readonly name: string;
    readonly value: string;
  }[];
}

const initialState: ActionState = {
  success: false,
};

export function StaffActionForm({
  action,
  children,
  fields,
}: StaffActionFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-2">
      {fields.map((field) => (
        <input
          key={field.name}
          name={field.name}
          type="hidden"
          value={field.value}
        />
      ))}
      {children === "Delete" ? (
        <ConfirmationDialog
          confirmLabel="Delete staff member"
          description="This staff member will be moved to deleted records and can be restored later."
          title="Delete this staff member?"
          triggerLabel="Delete"
        />
      ) : (
        <Button type="submit" variant="outline">
          {children}
        </Button>
      )}
      {state.message ? (
        <p className="sr-only" role={state.success ? "status" : "alert"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
