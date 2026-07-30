import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PaymentReceipt } from "@/features/payments/presentation/payment-receipt";

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

describe("PaymentReceipt", () => {
  it("renders immutable receipt snapshots and current calculated totals", () => {
    render(<PaymentReceipt payment={payment} totals={totals} />);
    expect(screen.getByRole("article", { name: "Receipt" })).toBeVisible();
    expect(screen.getByText("The Gentleman")).toBeVisible();
    expect(screen.getByText("Alex")).toBeVisible();
    expect(screen.getByText("Haircut")).toBeVisible();
    expect(screen.getByText(/Current outstanding/)).toBeVisible();
  });
});
