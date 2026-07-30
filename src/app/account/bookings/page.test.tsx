import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({ protect: vi.fn() }));
const repositories = vi.hoisted(() => ({
  listBookings: vi.fn(),
  listBookingSelectionOptions: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: { protect } }));
vi.mock("@/features/bookings/data/booking.repository", () => repositories);
vi.mock("@/features/bookings/presentation/booking-management-page", () => ({
  BookingManagementPage: (props: {
    readonly options: unknown;
    readonly result: unknown;
  }) => <main data-testid="booking-management-page" {...props} />,
}));

import Page from "@/app/account/bookings/page";

describe("booking management page", () => {
  it("protects and loads filters, bookings, and options", async () => {
    const result = {
      data: [],
      pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
    };
    const options = { customers: [], services: [], staff: [] };
    repositories.listBookings.mockResolvedValueOnce(result);
    repositories.listBookingSelectionOptions.mockResolvedValueOnce(options);

    const element = await Page({
      searchParams: Promise.resolve({ search: "alex" }),
    });

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.listBookings).toHaveBeenCalledWith(
      expect.objectContaining({ search: "alex" }),
    );
    expect(element.props.result).toBe(result);
    expect(element.props.options).toBe(options);
  });
});
