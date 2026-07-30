import { revalidatePath } from "next/cache";

import type { BookingWorkflowActionState } from "@/features/appointments/types/booking-workflow.types";

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function actionFailure(message: string): BookingWorkflowActionState {
  return { message, success: false };
}

export function revalidateBookingWorkflowPaths(id: string) {
  revalidatePath("/account");
  revalidatePath("/account/appointments");
  revalidatePath(`/account/appointments/${id}`);
  revalidatePath("/account/bookings");
  revalidatePath(`/account/bookings/${id}/edit`);
  revalidatePath("/account/payments");
  revalidatePath(`/account/payments/checkout/${id}`);
}
