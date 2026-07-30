"use server";

import { auth } from "@clerk/nextjs/server";

import {
  actionFailure,
  formDataToObject,
  revalidatePaymentPaths,
  zodFailure,
} from "@/features/payments/actions/action-utils";
import { PAYMENT_SAFE_ERRORS } from "@/features/payments/constants/payment.constants";
import {
  completeCheckout,
  recordPayment,
  recordRefund,
} from "@/features/payments/data/payment.repository";
import type { PaymentActionState } from "@/features/payments/types/payment-management.types";
import {
  completeCheckoutSchema,
  recordPaymentSchema,
  recordRefundSchema,
} from "@/features/payments/validation/payment.schema";

function safeFailure(error: unknown, fallback: string) {
  if (
    error instanceof Error &&
    (PAYMENT_SAFE_ERRORS.has(error.message) ||
      error.message === "This booking has no outstanding balance.")
  ) {
    return actionFailure(error.message);
  }
  return actionFailure(fallback);
}

export async function recordPaymentAction(
  _state: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  await auth.protect();
  const parsed = recordPaymentSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return zodFailure(parsed.error);

  try {
    const paymentId = await recordPayment(parsed.data);
    revalidatePaymentPaths(parsed.data.booking_id, paymentId);
    return { message: "Payment recorded.", paymentId, success: true };
  } catch (error) {
    return safeFailure(error, "Payment could not be recorded.");
  }
}

export async function completeCheckoutAction(
  _state: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  await auth.protect();
  const parsed = completeCheckoutSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return zodFailure(parsed.error);

  try {
    const paymentId = await completeCheckout(parsed.data);
    revalidatePaymentPaths(parsed.data.booking_id, paymentId);
    return { message: "Checkout completed.", paymentId, success: true };
  } catch (error) {
    return safeFailure(error, "Checkout could not be completed.");
  }
}

export async function recordRefundAction(
  _state: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  await auth.protect();
  const parsed = recordRefundSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) return zodFailure(parsed.error);

  try {
    const paymentId = await recordRefund(parsed.data);
    revalidatePaymentPaths(parsed.data.booking_id, paymentId);
    revalidatePaymentPaths(
      parsed.data.booking_id,
      parsed.data.original_payment_id,
    );
    return { message: "Refund recorded.", paymentId, success: true };
  } catch (error) {
    return safeFailure(error, "Refund could not be recorded.");
  }
}
