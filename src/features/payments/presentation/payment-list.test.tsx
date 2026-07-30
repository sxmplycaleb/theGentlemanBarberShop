import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PaymentList } from "@/features/payments/presentation/payment-list";

const payment = {
  amount_cents: 10_000,
  booking_id: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
  created_at: "2026-07-30T09:30:00.000Z",
  currency_code: "KES",
  entry_type: "payment" as const,
  id: "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77",
  original_payment_id: null,
  payment_date: "2026-07-30T09:30:00.000Z",
  payment_method: "mpesa" as const,
  receipt_booking_date: "2026-07-30",
  receipt_business_name: "The Gentleman",
  receipt_customer_name: "Alex",
  receipt_service_name: "Haircut",
  receipt_staff_name: "Sam",
  receipt_start_time: "09:00:00",
  reference_number: "REF-1",
  refund_reason: null,
};

describe("PaymentList", () => {
  it("renders receipt snapshots, method, reference, amount, and detail link", () => {
    render(
      <PaymentList
        result={{
          data: [payment],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 1 },
        }}
      />,
    );
    expect(screen.getByText("Alex")).toBeVisible();
    expect(screen.getByText("Haircut")).toBeVisible();
    expect(screen.getByText("M-Pesa")).toBeVisible();
    expect(screen.getByText("REF-1")).toBeVisible();
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      `/account/payments/${payment.id}`,
    );
  });

  it("renders refunds and the empty state", () => {
    const { rerender } = render(
      <PaymentList
        result={{
          data: [{ ...payment, entry_type: "refund" }],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 1 },
        }}
      />,
    );
    expect(screen.getByText("Refund")).toBeVisible();
    rerender(
      <PaymentList
        result={{
          data: [],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
        }}
      />,
    );
    expect(
      screen.getByText("No payments match the current filters."),
    ).toBeVisible();
  });
});
