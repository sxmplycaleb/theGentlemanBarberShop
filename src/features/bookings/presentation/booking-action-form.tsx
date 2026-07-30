"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  BOOKING_STATUSES,
  type ActionState,
  type BookingStatus,
} from "@/features/bookings/types/booking-management.types";

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
      <Button type="submit" variant="outline">
        {children}
      </Button>
      {state.message ? (
        <p className="sr-only" role={state.success ? "status" : "alert"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

interface BookingStatusActionFormProps {
  readonly action: (
    previousState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  readonly id: string;
  readonly status: BookingStatus;
}

export function BookingStatusActionForm({
  action,
  id,
  status,
}: BookingStatusActionFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid min-w-32 gap-2">
      <input name="id" type="hidden" value={id} />
      <label className="sr-only" htmlFor={`status-${id}`}>
        Booking status
      </label>
      <select
        className="border-border bg-background min-h-9 rounded-sm border px-2 text-xs"
        defaultValue={status}
        id={`status-${id}`}
        name="status"
      >
        {BOOKING_STATUSES.map((value) => (
          <option key={value} value={value}>
            {value === "no_show"
              ? "No show"
              : `${value.charAt(0).toUpperCase()}${value.slice(1)}`}
          </option>
        ))}
      </select>
      <Button type="submit" variant="outline">
        Update status
      </Button>
      {state.message ? (
        <p className="sr-only" role={state.success ? "status" : "alert"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
