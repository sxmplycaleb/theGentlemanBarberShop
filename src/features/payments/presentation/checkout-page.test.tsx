import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CheckoutPage } from "@/features/payments/presentation/checkout-page";

const bookingId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";
const detail = {
  booking: {
    booking_date: "2026-07-30",
    charge_amount_cents: 20_000,
    charge_currency_code: "KES",
    created_at: "2026-07-01T00:00:00Z",
    customer: {
      deleted_at: null,
      full_name: "Alex",
      id: bookingId,
      is_active: true,
    },
    customer_id: bookingId,
    deleted_at: null,
    id: bookingId,
    service: {
      deleted_at: null,
      id: bookingId,
      is_active: true,
      name: "Haircut",
    },
    service_id: bookingId,
    staff: {
      deleted_at: null,
      display_name: "Sam",
      id: bookingId,
      is_active: true,
    },
    staff_id: bookingId,
    start_time: "09:00:00",
    status: "confirmed" as const,
    updated_at: "2026-07-01T00:00:00Z",
  },
  totals: {
    booking_id: bookingId,
    charge_amount_cents: 20_000,
    currency_code: "KES",
    gross_paid_cents: 5_000,
    net_paid_cents: 5_000,
    outstanding_balance_cents: 15_000,
    total_refunded_cents: 0,
  },
};
const history = {
  data: [],
  pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
};

describe("CheckoutPage", () => {
  it("renders booking relationships, derived balances, and payment workflows", () => {
    render(
      <CheckoutPage
        completeAction={vi.fn()}
        defaultPaymentDate="2026-07-30T09:30"
        detail={detail}
        history={history}
        historyPage={1}
        recordAction={vi.fn()}
      />,
    );
    expect(screen.getByRole("heading", { name: "Checkout" })).toBeVisible();
    expect(screen.getByText("Alex")).toBeVisible();
    expect(screen.getByText("Record partial payment")).toBeVisible();
    expect(screen.getByText("Full checkout")).toBeVisible();
  });

  it("hides payment forms for settled and cancelled bookings", () => {
    render(
      <CheckoutPage
        completeAction={vi.fn()}
        defaultPaymentDate="2026-07-30T09:30"
        detail={{
          booking: { ...detail.booking, status: "cancelled" },
          totals: { ...detail.totals, outstanding_balance_cents: 0 },
        }}
        history={history}
        historyPage={1}
        recordAction={vi.fn()}
      />,
    );
    expect(screen.getByText("Financially settled")).toBeVisible();
    expect(
      screen.queryByText("Record partial payment"),
    ).not.toBeInTheDocument();
  });

  it("explains cancelled and deleted payment restrictions", () => {
    const { rerender } = render(
      <CheckoutPage
        completeAction={vi.fn()}
        defaultPaymentDate="2026-07-30T09:30"
        detail={{
          booking: { ...detail.booking, status: "cancelled" },
          totals: detail.totals,
        }}
        history={history}
        historyPage={1}
        recordAction={vi.fn()}
      />,
    );
    expect(screen.getByText("Payments unavailable")).toBeVisible();
    expect(screen.getByText(/Cancelled bookings cannot accept/)).toBeVisible();

    rerender(
      <CheckoutPage
        completeAction={vi.fn()}
        defaultPaymentDate="2026-07-30T09:30"
        detail={{
          booking: {
            ...detail.booking,
            deleted_at: "2026-07-30T10:00:00Z",
          },
          totals: detail.totals,
        }}
        history={history}
        historyPage={1}
        recordAction={vi.fn()}
      />,
    );
    expect(screen.getByText(/Deleted bookings cannot accept/)).toBeVisible();
  });
});
