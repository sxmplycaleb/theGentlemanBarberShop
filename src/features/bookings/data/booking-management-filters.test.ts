import { describe, expect, it } from "vitest";

import { parseBookingListFilters } from "@/features/bookings/data/booking-management-filters";

const customerId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";

describe("booking management filters", () => {
  it("returns safe defaults", () => {
    expect(parseBookingListFilters({})).toEqual({
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
    });
  });

  it("parses allow-listed filters and first repeated values", () => {
    expect(
      parseBookingListFilters({
        customer: [customerId, "ignored"],
        date_from: "2026-08-01",
        date_to: "2026-08-31",
        deleted: "all",
        direction: "desc",
        page: "3",
        search: "  Alex  ",
        sort: "updated_at",
        status: "confirmed",
      }),
    ).toMatchObject({
      customerId,
      dateFrom: "2026-08-01",
      dateTo: "2026-08-31",
      deleted: "all",
      direction: "desc",
      page: 3,
      search: "Alex",
      sort: "updated_at",
      status: "confirmed",
    });
  });

  it("rejects invalid identifiers, ranges, and allow-list values", () => {
    expect(
      parseBookingListFilters({
        customer: "invalid",
        date_from: "2026-09-01",
        date_to: "2026-08-01",
        deleted: "other",
        direction: "sideways",
        page: "-2",
        service: "invalid",
        sort: "customer",
        staff: "invalid",
        status: "scheduled",
      }),
    ).toMatchObject({
      customerId: "",
      dateFrom: "",
      dateTo: "",
      deleted: "not-deleted",
      direction: "asc",
      page: 1,
      serviceId: "",
      sort: "booking_date",
      staffId: "",
      status: "all",
    });
  });
});
