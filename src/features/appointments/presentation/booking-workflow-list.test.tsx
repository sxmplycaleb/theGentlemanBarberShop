import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/appointments/actions/appointment-workflow.actions", () => ({
  transitionBookingStatusAction: vi.fn(),
}));

import { BookingWorkflowList } from "@/features/appointments/presentation/booking-workflow-list";

const id = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";
const filters = {
  bookingDate: "2026-08-10",
  direction: "asc" as const,
  page: 1,
  pageSize: 10,
  search: "",
  sort: "start_time" as const,
  staffId: "",
  status: "all" as const,
};
const booking = {
  availableTransitions: ["confirmed", "cancelled"] as const,
  booking_date: "2026-08-10",
  charge_amount_cents: 250000,
  charge_currency_code: "KES",
  created_at: "2026-08-01T00:00:00Z",
  customer: { deleted_at: null, full_name: "Alex", id, is_active: true },
  customer_id: id,
  deleted_at: null,
  id,
  service: { deleted_at: null, id, is_active: true, name: "Haircut" },
  service_id: id,
  staff: {
    deleted_at: null,
    display_name: "Sam",
    id,
    is_active: true,
  },
  staff_id: id,
  start_time: "09:30:00",
  status: "pending" as const,
  updated_at: "2026-08-01T00:00:00Z",
};

describe("BookingWorkflowList", () => {
  it("renders joined booking data and only server-derived transitions", () => {
    render(
      <BookingWorkflowList
        filters={filters}
        options={{ staff: [] }}
        result={{
          data: [booking],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 1 },
        }}
        searchParams={{ search: "Alex" }}
      />,
    );

    expect(screen.getByText("Alex")).toBeVisible();
    expect(screen.getByText("Sam")).toBeVisible();
    expect(screen.getByText("Haircut")).toBeVisible();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Complete" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      `/account/appointments/${id}`,
    );
    expect(screen.getByRole("link", { name: "Checkout" })).toHaveAttribute(
      "href",
      `/account/payments/checkout/${id}`,
    );
  });

  it("renders the empty queue state", () => {
    render(
      <BookingWorkflowList
        filters={filters}
        options={{ staff: [] }}
        result={{
          data: [],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
        }}
        searchParams={{}}
      />,
    );

    expect(
      screen.getByText("No appointments match the current filters."),
    ).toBeVisible();
  });
});
