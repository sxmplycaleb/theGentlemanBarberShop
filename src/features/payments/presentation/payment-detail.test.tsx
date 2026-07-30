import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PaymentDetail } from "@/features/payments/presentation/payment-detail";

const payment = {
  amount_cents: 10_000,
  booking_id: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
  created_at: "2026-07-30T09:30:00.000Z",
  currency_code: "KES",
  entry_type: "payment" as const,
  id: "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77",
  original_payment_id: null,
  payment_date: "2026-07-30T09:30:00.000Z",
  payment_method: "cash" as const,
  receipt_booking_date: "2026-07-30",
  receipt_business_name: "The Gentleman",
  receipt_customer_name: "Alex",
  receipt_service_name: "Haircut",
  receipt_staff_name: "Sam",
  receipt_start_time: "09:00:00",
  reference_number: null,
  refund_reason: null,
};
const totals = {
  booking_id: payment.booking_id,
  charge_amount_cents: 20_000,
  currency_code: "KES",
  gross_paid_cents: 10_000,
  net_paid_cents: 10_000,
  outstanding_balance_cents: 10_000,
  total_refunded_cents: 0,
};

describe("PaymentDetail", () => {
  it("renders receipt, refund workflow, and navigation", () => {
    render(
      <PaymentDetail
        defaultPaymentDate="2026-07-30T09:30"
        detail={{
          payment,
          refundableAmountCents: 10_000,
          refunds: [],
          totals,
        }}
        refundAction={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Payment details" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: "Record refund" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Booking checkout" }),
    ).toHaveAttribute(
      "href",
      `/account/payments/checkout/${payment.booking_id}`,
    );
  });

  it("links refund receipts to their original payment", () => {
    render(
      <PaymentDetail
        defaultPaymentDate="2026-07-30T09:30"
        detail={{
          payment: {
            ...payment,
            entry_type: "refund",
            original_payment_id: "3bbc8fb4-f88b-491a-84f4-463b9cda4279",
            refund_reason: "Customer request",
          },
          refundableAmountCents: 0,
          refunds: [],
          totals,
        }}
        refundAction={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("link", { name: "View original payment" }),
    ).toBeVisible();
  });

  it("renders a fully refunded state and recorded refund receipts", () => {
    const refund = {
      ...payment,
      amount_cents: 10_000,
      entry_type: "refund" as const,
      id: "3bbc8fb4-f88b-491a-84f4-463b9cda4279",
      original_payment_id: payment.id,
      refund_reason: "Customer request",
    };
    render(
      <PaymentDetail
        defaultPaymentDate="2026-07-30T09:30"
        detail={{
          payment,
          refundableAmountCents: 0,
          refunds: [refund],
          totals,
        }}
        refundAction={vi.fn()}
      />,
    );
    expect(screen.getByText("This payment is fully refunded.")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Refund receipt" }),
    ).toHaveAttribute("href", `/account/payments/${refund.id}`);
  });
});
