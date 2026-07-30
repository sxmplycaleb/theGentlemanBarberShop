"use server";

import { auth } from "@clerk/nextjs/server";

import {
  actionFailure,
  actionSuccess,
  formDataToObject,
  revalidateBookingManagementPaths,
  zodErrorsToActionState,
} from "@/features/bookings/actions/action-utils";
import {
  createBooking,
  restoreBooking,
  softDeleteBooking,
  updateBooking,
} from "@/features/bookings/data/booking.repository";
import type { ActionState } from "@/features/bookings/types/booking-management.types";
import {
  bookingFormSchema,
  bookingIdSchema,
} from "@/features/bookings/validation/booking.schema";

function safeFailure(error: unknown, fallback: string) {
  return actionFailure(error instanceof Error ? error.message : fallback);
}

export async function createBookingAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await auth.protect();
  const parsed = bookingFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return zodErrorsToActionState(parsed.error);
  }

  try {
    await createBooking(parsed.data);
    revalidateBookingManagementPaths();
    return actionSuccess("Booking created.");
  } catch (error) {
    return safeFailure(
      error,
      "Booking could not be created. Please try again.",
    );
  }
}

export async function updateBookingAction(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await auth.protect();
  const idResult = bookingIdSchema.safeParse({ id });
  const valuesResult = bookingFormSchema.safeParse(formDataToObject(formData));

  if (!idResult.success) {
    return actionFailure("Invalid booking.");
  }

  if (!valuesResult.success) {
    return zodErrorsToActionState(valuesResult.error);
  }

  try {
    await updateBooking(idResult.data.id, valuesResult.data);
    revalidateBookingManagementPaths();
    return actionSuccess("Booking updated.");
  } catch (error) {
    return safeFailure(
      error,
      "Booking could not be updated. Please try again.",
    );
  }
}

export async function softDeleteBookingAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await auth.protect();
  const parsed = bookingIdSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return actionFailure("Invalid booking.");
  }

  try {
    await softDeleteBooking(parsed.data.id);
    revalidateBookingManagementPaths();
    return actionSuccess("Booking deleted.");
  } catch (error) {
    return safeFailure(error, "Booking could not be deleted.");
  }
}

export async function restoreBookingAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await auth.protect();
  const parsed = bookingIdSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return actionFailure("Invalid booking.");
  }

  try {
    await restoreBooking(parsed.data.id);
    revalidateBookingManagementPaths();
    return actionSuccess("Booking restored.");
  } catch (error) {
    return safeFailure(error, "Booking could not be restored.");
  }
}
