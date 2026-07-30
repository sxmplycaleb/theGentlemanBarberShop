import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import type { PaymentActionState } from "@/features/payments/types/payment-management.types";

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function actionFailure(
  message: string,
  errors?: Record<string, readonly string[]>,
): PaymentActionState {
  return errors
    ? { errors, message, success: false }
    : { message, success: false };
}

export function zodFailure(error: ZodError): PaymentActionState {
  return actionFailure(
    "Check the highlighted fields.",
    error.flatten().fieldErrors,
  );
}

export function revalidatePaymentPaths(bookingId: string, paymentId?: string) {
  revalidatePath("/account");
  revalidatePath("/account/payments");
  revalidatePath(`/account/payments/checkout/${bookingId}`);
  revalidatePath("/account/bookings");
  revalidatePath(`/account/bookings/${bookingId}/edit`);
  revalidatePath("/account/appointments");
  revalidatePath(`/account/appointments/${bookingId}`);
  if (paymentId) revalidatePath(`/account/payments/${paymentId}`);
}
