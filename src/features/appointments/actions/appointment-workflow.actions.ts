"use server";

import { auth } from "@clerk/nextjs/server";

import {
  actionFailure,
  formDataToObject,
  revalidateBookingWorkflowPaths,
} from "@/features/appointments/actions/action-utils";
import { resolveBusinessDate } from "@/features/appointments/data/business-date";
import { transitionBookingStatus } from "@/features/appointments/data/booking-workflow.repository";
import type { BookingWorkflowActionState } from "@/features/appointments/types/booking-workflow.types";
import { bookingTransitionSchema } from "@/features/appointments/validation/appointment-workflow.schema";
import { getBusinessSettings } from "@/features/business-settings/data/business-settings.repository";
import { DEFAULT_BUSINESS_SETTINGS } from "@/features/business-settings/constants/business-settings.constants";

const safeFailureMessages = new Set([
  "Booking status could not be updated.",
  "That booking status transition is not allowed.",
  "This booking has changed or the transition is no longer available. Refresh and try again.",
]);

export async function transitionBookingStatusAction(
  _state: BookingWorkflowActionState,
  formData: FormData,
): Promise<BookingWorkflowActionState> {
  await auth.protect();
  const parsed = bookingTransitionSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return actionFailure("Invalid booking transition.");

  try {
    const settings = await getBusinessSettings();
    const businessDate = resolveBusinessDate(
      settings?.timezone ?? DEFAULT_BUSINESS_SETTINGS.timezone,
    );
    await transitionBookingStatus(parsed.data, businessDate);
    revalidateBookingWorkflowPaths(parsed.data.booking_id);
    return { message: "Booking status updated.", success: true };
  } catch (error) {
    const message =
      error instanceof Error && safeFailureMessages.has(error.message)
        ? error.message
        : "Booking status could not be updated.";
    return actionFailure(message);
  }
}
