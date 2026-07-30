import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/bookings/actions/booking.actions", () => ({
  restoreBookingAction: vi.fn(),
  setBookingStatusAction: vi.fn(),
  softDeleteBookingAction: vi.fn(),
}));

import { BookingList } from "@/features/bookings/presentation/booking-list";
import type { BookingListFilters } from "@/features/bookings/types/booking-management.types";

const id = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";
const filters: BookingListFilters = {
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
};
const options = { customers: [], services: [], staff: [] };
const booking = {
  booking_date: "2026-08-10",
  created_at: "2026-07-30T00:00:00.000Z",
  customer: {
    deleted_at: null,
    full_name: "Alex",
    id,
    is_active: true,
  },
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
  updated_at: "2026-07-30T00:00:00.000Z",
};

describe("BookingList", () => {
  it("renders joined booking data and current actions", () => {
    render(
      <BookingList
        filters={filters}
        options={options}
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
    expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute(
      "href",
      `/account/bookings/${id}/edit`,
    );
    expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
    expect(screen.getByText(/1 records/)).toBeVisible();
  });

  it("shows restore only for deleted bookings", () => {
    render(
      <BookingList
        filters={{ ...filters, deleted: "deleted" }}
        options={options}
        result={{
          data: [{ ...booking, deleted_at: "2026-07-30T01:00:00.000Z" }],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 1 },
        }}
        searchParams={{}}
      />,
    );
    expect(screen.getAllByText("Deleted")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Restore" })).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "Edit" }),
    ).not.toBeInTheDocument();
  });

  it("renders the empty state", () => {
    render(
      <BookingList
        filters={filters}
        options={options}
        result={{
          data: [],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
        }}
        searchParams={{}}
      />,
    );
    expect(
      screen.getByText("No bookings match the current filters."),
    ).toBeVisible();
  });
});
