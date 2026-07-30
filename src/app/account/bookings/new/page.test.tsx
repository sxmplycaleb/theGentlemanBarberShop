import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({ protect: vi.fn() }));
const repositories = vi.hoisted(() => ({
  listBookingSelectionOptions: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: { protect } }));
vi.mock("@/features/bookings/actions/booking.actions", () => ({
  createBookingAction: vi.fn(),
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

import Page from "@/app/account/bookings/new/page";

describe("new booking page", () => {
  it("protects and loads selections before rendering", async () => {
    const options = { customers: [], services: [], staff: [] };
    repositories.listBookingSelectionOptions.mockResolvedValueOnce(options);
    const element = await Page();
    expect(protect).toHaveBeenCalledOnce();
    expect(element.props.title).toBe("New booking");
    expect(element.props.children.props.options).toBe(options);
    expect(element.props.children.props.submitLabel).toBe("Create booking");
  });
});
