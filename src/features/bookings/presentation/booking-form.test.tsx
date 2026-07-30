import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BookingForm } from "@/features/bookings/presentation/booking-form";

const ids = {
  customer: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
  service: "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77",
  staff: "3bbc8fb4-f88b-491a-84f4-463b9cda4279",
};
const options = {
  customers: [
    {
      deleted_at: null,
      full_name: "Alex",
      id: ids.customer,
      is_active: true,
    },
  ],
  services: [
    {
      deleted_at: null,
      id: ids.service,
      is_active: true,
      name: "Haircut",
    },
  ],
  staff: [
    {
      deleted_at: null,
      display_name: "Sam",
      id: ids.staff,
      is_active: true,
    },
  ],
};

describe("BookingForm", () => {
  it("renders create selections and booking fields", () => {
    render(
      <BookingForm
        action={vi.fn()}
        options={options}
        submitLabel="Create booking"
      />,
    );
    expect(screen.getByLabelText("Customer")).toHaveValue("");
    expect(screen.getByLabelText("Staff")).toHaveValue("");
    expect(screen.getByLabelText("Service")).toHaveValue("");
    expect(screen.getByLabelText("Booking date")).toBeRequired();
    expect(screen.getByLabelText("Start time")).toBeRequired();
    expect(
      screen.getByRole("button", { name: "Create booking" }),
    ).toBeEnabled();
  });

  it("renders edit values and historical option labels", () => {
    render(
      <BookingForm
        action={vi.fn()}
        booking={{
          booking_date: "2026-08-10",
          customer_id: ids.customer,
          service_id: ids.service,
          staff_id: ids.staff,
          start_time: "09:30:00",
          status: "confirmed",
        }}
        options={{
          ...options,
          customers: [
            {
              ...options.customers[0]!,
              deleted_at: "deleted",
              is_active: false,
            },
          ],
        }}
        submitLabel="Update booking"
      />,
    );
    expect(screen.getByLabelText("Customer")).toHaveValue(ids.customer);
    expect(
      screen.getByRole("option", { name: "Alex (deleted)" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Start time")).toHaveValue("09:30");
    expect(screen.getByLabelText("Status")).toHaveValue("confirmed");
  });

  it("disables saving when required selections are unavailable", () => {
    render(
      <BookingForm
        action={vi.fn()}
        options={{ customers: [], services: [], staff: [] }}
        submitLabel="Create booking"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Add at least one active customer",
    );
    expect(
      screen.getByRole("button", { name: "Create booking" }),
    ).toBeDisabled();
  });
});
