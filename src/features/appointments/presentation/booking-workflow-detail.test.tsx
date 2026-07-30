import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/appointments/actions/appointment-workflow.actions", () => ({
  transitionBookingStatusAction: vi.fn(),
}));

import { BookingWorkflowDetail } from "@/features/appointments/presentation/booking-workflow-detail";
import type { BookingStatus } from "@/features/bookings/types/booking-management.types";

const booking = {
  availableTransitions: ["confirmed", "cancelled"] as const,
  booking_date: "2026-08-10",
  charge_amount_cents: 250000,
  charge_currency_code: "KES",
  created_at: "",
  customer: null,
  customer_id: "",
  deleted_at: null,
  id: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
  service: null,
  service_id: "",
  staff: null,
  staff_id: "",
  start_time: "09:30:00",
  status: "pending" as const,
  updated_at: "",
};

describe("BookingWorkflowDetail", () => {
  it("renders booking projections and supplied transitions", () => {
    render(<BookingWorkflowDetail booking={booking} />);
    expect(
      screen.getByRole("heading", { name: "Appointment details" }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  it.each<BookingStatus>(["completed", "cancelled", "no_show"])(
    "renders terminal %s state without controls",
    (status) => {
      render(
        <BookingWorkflowDetail
          booking={{ ...booking, availableTransitions: [], status }}
        />,
      );
      expect(screen.getByText(/terminal workflow state/)).toBeVisible();
    },
  );

  it("renders every supplied confirmed-state transition", () => {
    render(
      <BookingWorkflowDetail
        booking={{
          ...booking,
          availableTransitions: ["completed", "cancelled", "no_show"],
          status: "confirmed",
        }}
      />,
    );
    expect(screen.getByRole("button", { name: "Complete" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Mark no-show" })).toBeVisible();
  });
});
