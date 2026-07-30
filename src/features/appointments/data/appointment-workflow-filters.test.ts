import { describe, expect, it } from "vitest";

import { parseBookingWorkflowFilters } from "@/features/appointments/data/appointment-workflow-filters";

describe("appointment workflow filters", () => {
  it("defaults to the business date", () => {
    expect(parseBookingWorkflowFilters({}, "2026-08-10")).toMatchObject({
      bookingDate: "2026-08-10",
      direction: "asc",
      page: 1,
      sort: "start_time",
      status: "all",
    });
  });

  it("normalizes allow-listed filters", () => {
    expect(
      parseBookingWorkflowFilters(
        {
          date: "2026-08-12",
          direction: "desc",
          page: "2",
          search: " Alex ",
          sort: "status",
          staff: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
          status: "confirmed",
        },
        "2026-08-10",
      ),
    ).toMatchObject({
      bookingDate: "2026-08-12",
      direction: "desc",
      page: 2,
      search: "Alex",
      sort: "status",
      status: "confirmed",
    });
  });
});
