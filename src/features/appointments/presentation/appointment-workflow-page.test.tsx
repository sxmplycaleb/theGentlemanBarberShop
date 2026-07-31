import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="user-button" />,
}));
vi.mock("@/features/appointments/presentation/booking-workflow-list", () => ({
  BookingWorkflowList: () => <section data-testid="booking-workflow-list" />,
}));

import { AppointmentWorkflowPage } from "@/features/appointments/presentation/appointment-workflow-page";

describe("AppointmentWorkflowPage", () => {
  it("renders the operational workflow shell and business date", () => {
    render(
      <AppointmentWorkflowPage
        businessDate="2026-08-10"
        filters={{
          bookingDate: "2026-08-10",
          direction: "asc",
          page: 1,
          pageSize: 10,
          search: "",
          sort: "start_time",
          staffId: "",
          status: "all",
        }}
        options={{ staff: [] }}
        result={{
          data: [],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
        }}
        searchParams={{}}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Appointment workflow" }),
    ).toBeVisible();
    expect(screen.getByText(/Business date: 2026-08-10/)).toBeVisible();
    expect(screen.getByTestId("booking-workflow-list")).toBeVisible();
  });
});
