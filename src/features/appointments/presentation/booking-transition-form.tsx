"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/management/submit-button";
import type { BookingWorkflowActionState } from "@/features/appointments/types/booking-workflow.types";
import type { BookingStatus } from "@/features/bookings/types/booking-management.types";

const labels: Record<BookingStatus, string> = {
  cancelled: "Cancel",
  completed: "Complete",
  confirmed: "Confirm",
  no_show: "Mark no-show",
  pending: "Pending",
};

export function BookingTransitionForm({
  action,
  bookingId,
  expectedStatus,
  targetStatus,
}: {
  readonly action: (
    state: BookingWorkflowActionState,
    formData: FormData,
  ) => Promise<BookingWorkflowActionState>;
  readonly bookingId: string;
  readonly expectedStatus: BookingStatus;
  readonly targetStatus: BookingStatus;
}) {
  const [state, formAction] = useActionState(action, { success: false });
  return (
    <form action={formAction} className="grid gap-2">
      <input name="booking_id" type="hidden" value={bookingId} />
      <input name="expected_status" type="hidden" value={expectedStatus} />
      <input name="target_status" type="hidden" value={targetStatus} />
      <SubmitButton>{labels[targetStatus]}</SubmitButton>
      {state.message ? (
        <p className="text-xs" role={state.success ? "status" : "alert"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
