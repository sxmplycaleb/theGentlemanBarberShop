import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import type { ActionState } from "@/features/bookings/types/booking-management.types";

export const actionSuccess = (message: string): ActionState => ({
  message,
  success: true,
});

export const actionFailure = (
  message: string,
  errors?: Record<string, readonly string[]>,
): ActionState =>
  errors ? { errors, message, success: false } : { message, success: false };

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function zodErrorsToActionState(error: ZodError): ActionState {
  return actionFailure(
    "Check the highlighted fields.",
    error.flatten().fieldErrors,
  );
}

export function revalidateBookingManagementPaths() {
  revalidatePath("/account");
  revalidatePath("/account/bookings");
}
