import { z } from "zod";

import { BUSINESS_CURRENCY_CODES } from "@/features/business-settings/constants/business-settings.constants";
import {
  PAYMENT_METHODS,
  PAYMENT_REFERENCE_MAX_LENGTH,
  REFUND_REASON_MAX_LENGTH,
} from "@/features/payments/constants/payment.constants";

const maximumAmountCents = 2_147_483_647;

const amountSchema = z
  .string()
  .trim()
  .regex(
    /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/,
    "Enter a positive amount with no more than two decimal places.",
  )
  .transform((value) => {
    const [whole = "0", fraction = ""] = value.split(".");
    return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  })
  .pipe(
    z
      .number()
      .int()
      .positive("Amount must be greater than zero.")
      .max(maximumAmountCents, "Amount is too large.")
      .safe(),
  );

const optionalReferenceSchema = z
  .string()
  .trim()
  .max(
    PAYMENT_REFERENCE_MAX_LENGTH,
    `Reference must be ${PAYMENT_REFERENCE_MAX_LENGTH} characters or fewer.`,
  )
  .transform((value) => value || null);

const paymentDateSchema = z
  .string()
  .trim()
  .regex(
    /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/,
    "Enter a valid UTC payment date and time.",
  )
  .transform((value) => `${value}:00.000Z`)
  .refine(
    (value) => Date.parse(value) <= Date.now(),
    "Payment date cannot be in the future.",
  );

const commonFields = {
  booking_id: z.uuid("Choose a valid booking."),
  currency_code: z.enum(BUSINESS_CURRENCY_CODES),
  payment_date: paymentDateSchema,
  payment_method: z.enum(PAYMENT_METHODS),
  reference_number: optionalReferenceSchema,
};

export const paymentIdSchema = z.object({ id: z.uuid() }).strict();

export const bookingPaymentIdSchema = z
  .object({ booking_id: z.uuid() })
  .strict();

export const recordPaymentSchema = z
  .object({
    ...commonFields,
    amount: amountSchema,
  })
  .strict();

export const completeCheckoutSchema = z.object(commonFields).strict();

export const recordRefundSchema = z
  .object({
    ...commonFields,
    amount: amountSchema,
    original_payment_id: z.uuid("Choose a valid original payment."),
    refund_reason: z
      .string()
      .trim()
      .min(1, "Enter a refund reason.")
      .max(
        REFUND_REASON_MAX_LENGTH,
        `Refund reason must be ${REFUND_REASON_MAX_LENGTH} characters or fewer.`,
      ),
  })
  .strict();

export type RecordPaymentValues = z.infer<typeof recordPaymentSchema>;
export type CompleteCheckoutValues = z.infer<typeof completeCheckoutSchema>;
export type RecordRefundValues = z.infer<typeof recordRefundSchema>;
