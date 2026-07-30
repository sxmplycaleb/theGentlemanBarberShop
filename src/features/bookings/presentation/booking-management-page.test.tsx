import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="user-button" />,
}));
vi.mock("@/features/bookings/presentation/booking-list", () => ({
  BookingList: () => <section data-testid="booking-list" />,
}));

import { BookingFormPage } from "@/features/bookings/presentation/booking-form-page";
import { BookingManagementPage } from "@/features/bookings/presentation/booking-management-page";

describe("booking page presentation", () => {
  it("renders the management shell", () => {
    render(
      <BookingManagementPage
        filters={{
          customerId: "",
          dateFrom: "",
          dateTo: "",
          deleted: "not-deleted",
          direction: "asc",
          page: 1,
          pageSize: 10,
          search: "",
          serviceId: "",
          sort: "booking_date",
          staffId: "",
          status: "all",
        }}
        options={{ customers: [], services: [], staff: [] }}
        result={{
          data: [],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
        }}
        searchParams={{}}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Booking management" }),
    ).toBeVisible();
    expect(screen.getByTestId("booking-list")).toBeVisible();
  });

  it("renders the form shell", () => {
    render(
      <BookingFormPage title="New booking">
        <form>Booking form</form>
      </BookingFormPage>,
    );
    expect(screen.getByRole("heading", { name: "New booking" })).toBeVisible();
    expect(screen.getByText("Booking form")).toBeVisible();
  });
});
