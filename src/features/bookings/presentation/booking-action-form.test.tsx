import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  BookingActionForm,
  BookingStatusActionForm,
} from "@/features/bookings/presentation/booking-action-form";

const id = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";

describe("booking action forms", () => {
  it("renders an identifier action", () => {
    render(
      <BookingActionForm action={vi.fn()} id={id}>
        Delete
      </BookingActionForm>,
    );
    expect(screen.getByDisplayValue(id)).toHaveAttribute("name", "id");
    expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
  });

  it("renders all status choices", () => {
    render(
      <BookingStatusActionForm action={vi.fn()} id={id} status="pending" />,
    );
    expect(screen.getByLabelText("Booking status")).toHaveValue("pending");
    expect(screen.getByRole("option", { name: "No show" })).toBeVisible();
  });
});
