"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import type { ActionState } from "@/features/bookings/types/booking-management.types";

const initialState: ActionState = { success: false };

interface BookingActionFormProps {
  readonly action: (
    previousState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  readonly children: React.ReactNode;
  readonly id: string;
}

export function BookingActionForm({
  action,
  children,
  id,
}: BookingActionFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-2">
      <input name="id" type="hidden" value={id} />
      {children === "Delete" ? (
        <ConfirmationDialog
          confirmLabel="Delete booking"
          description="This booking will be moved to deleted records and can be restored later."
          title="Delete this booking?"
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
