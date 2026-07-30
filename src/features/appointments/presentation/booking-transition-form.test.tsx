import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BookingTransitionForm } from "@/features/appointments/presentation/booking-transition-form";

describe("BookingTransitionForm", () => {
  it("renders supplied server-derived transition values", () => {
    render(
      <BookingTransitionForm
        action={vi.fn()}
        bookingId="8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2"
        expectedStatus="pending"
        targetStatus="confirmed"
      />,
    );
    expect(screen.getByRole("button", { name: "Confirm" })).toBeVisible();
    expect(screen.getByDisplayValue("pending")).toHaveAttribute(
      "name",
      "expected_status",
    );
  });
});
