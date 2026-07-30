import { describe, expect, it } from "vitest";

import {
  completeCheckoutSchema,
  paymentIdSchema,
  recordPaymentSchema,
  recordRefundSchema,
} from "@/features/payments/validation/payment.schema";

const bookingId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";
const common = {
  booking_id: bookingId,
  currency_code: "KES",
  payment_date: "2020-07-30T09:30",
  payment_method: "mpesa",
  reference_number: "  REF-123  ",
};

describe("payment validation", () => {
  it("converts exact decimal amounts to cents and normalizes references", () => {
    expect(
      recordPaymentSchema.parse({ ...common, amount: "1250.5" }),
    ).toMatchObject({
      amount: 125050,
      payment_date: "2020-07-30T09:30:00.000Z",
      reference_number: "REF-123",
    });
    expect(
      completeCheckoutSchema.parse({ ...common, reference_number: " " }),
    ).toMatchObject({ reference_number: null });
  });

  it("validates refunds and requires an administrative reason", () => {
    expect(
      recordRefundSchema.parse({
        ...common,
        amount: "10.00",
        original_payment_id: bookingId,
        refund_reason: "  Customer request  ",
      }),
    ).toMatchObject({
      amount: 1000,
      refund_reason: "Customer request",
    });
    expect(
      recordRefundSchema.safeParse({
        ...common,
        amount: "10",
        original_payment_id: bookingId,
        refund_reason: " ",
      }).success,
    ).toBe(false);
  });

  it("rejects ambiguity, unsafe values, future dates, invalid allow-lists, and unknown fields", () => {
    for (const amount of ["0", "-1", "1.234", "abc", "21474836.48"]) {
      expect(recordPaymentSchema.safeParse({ ...common, amount }).success).toBe(
        false,
      );
    }
    expect(
      recordPaymentSchema.safeParse({
        ...common,
        amount: "1",
        currency_code: "BTC",
      }).success,
    ).toBe(false);
    expect(
      recordPaymentSchema.safeParse({
        ...common,
        amount: "1",
        payment_method: "crypto",
      }).success,
    ).toBe(false);
    expect(
      recordPaymentSchema.safeParse({
        ...common,
        amount: "1",
        payment_date: "2999-01-01T00:00",
      }).success,
    ).toBe(false);
    expect(
      recordPaymentSchema.safeParse({ ...common, amount: "1", extra: true })
        .success,
    ).toBe(false);
    expect(paymentIdSchema.safeParse({ id: "invalid" }).success).toBe(false);
  });
});
