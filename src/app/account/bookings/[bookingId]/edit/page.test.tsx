import { beforeEach, describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({ protect: vi.fn() }));
const { notFound } = vi.hoisted(() => ({ notFound: vi.fn() }));
const repositories = vi.hoisted(() => ({
  getBookingById: vi.fn(),
  listBookingSelectionOptions: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: { protect } }));
vi.mock("next/navigation", () => ({ notFound }));
vi.mock("@/features/bookings/actions/booking.actions", () => ({
  updateBookingAction: vi.fn(),
}));
vi.mock("@/features/bookings/data/booking.repository", () => repositories);
vi.mock("@/features/bookings/presentation/booking-form", () => ({
  BookingForm: (props: { readonly submitLabel: string }) => (
    <form>{props.submitLabel}</form>
  ),
}));
vi.mock("@/features/bookings/presentation/booking-form-page", () => ({
  BookingFormPage: (props: {
    readonly children: React.ReactNode;
    readonly title: string;
  }) => <main data-title={props.title}>{props.children}</main>,
}));

import Page from "@/app/account/bookings/[bookingId]/edit/page";

const bookingId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";
const booking = {
  booking_date: "2026-08-10",
  customer_id: "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77",
  deleted_at: null,
  id: bookingId,
  service_id: "3bbc8fb4-f88b-491a-84f4-463b9cda4279",
  staff_id: "c4651894-b328-4873-8ea9-66ca850bcf45",
  start_time: "09:30:00",
  status: "pending",
};

describe("edit booking page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("protects, loads a current booking, and preserves selections", async () => {
    const options = { customers: [], services: [], staff: [] };
    repositories.getBookingById.mockResolvedValueOnce(booking);
    repositories.listBookingSelectionOptions.mockResolvedValueOnce(options);
    const element = await Page({ params: Promise.resolve({ bookingId }) });
    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.listBookingSelectionOptions).toHaveBeenCalledWith({
      customerId: booking.customer_id,
      serviceId: booking.service_id,
      staffId: booking.staff_id,
    });
    expect(element.props.children.props.booking).toMatchObject({
      booking_date: "2026-08-10",
    });
    expect(element.props.children.props.booking).not.toHaveProperty("status");
  });

  it("returns not found for invalid identifiers", async () => {
    notFound.mockImplementationOnce(() => {
      throw new Error("not found");
    });
    await expect(
      Page({ params: Promise.resolve({ bookingId: "invalid" }) }),
    ).rejects.toThrow("not found");
    expect(repositories.getBookingById).not.toHaveBeenCalled();
  });

  it("returns not found for missing or deleted bookings", async () => {
    notFound.mockImplementation(() => {
      throw new Error("not found");
    });
    repositories.getBookingById.mockResolvedValueOnce(null);
    await expect(
      Page({ params: Promise.resolve({ bookingId }) }),
    ).rejects.toThrow("not found");

    repositories.getBookingById.mockResolvedValueOnce({
      ...booking,
      deleted_at: "2026-07-30T01:00:00.000Z",
    });
    await expect(
      Page({ params: Promise.resolve({ bookingId }) }),
    ).rejects.toThrow("not found");
  });
});
