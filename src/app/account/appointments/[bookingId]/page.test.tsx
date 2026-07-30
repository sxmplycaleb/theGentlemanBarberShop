import { beforeEach, describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({ protect: vi.fn() }));
const { notFound } = vi.hoisted(() => ({ notFound: vi.fn() }));
const repositories = vi.hoisted(() => ({
  getBookingWorkflowDetail: vi.fn(),
  getBusinessSettings: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: { protect } }));
vi.mock("next/navigation", () => ({ notFound }));
vi.mock(
  "@/features/appointments/data/booking-workflow.repository",
  () => repositories,
);
vi.mock(
  "@/features/business-settings/data/business-settings.repository",
  () => ({
    getBusinessSettings: repositories.getBusinessSettings,
  }),
);
vi.mock("@/features/appointments/data/business-date", () => ({
  resolveBusinessDate: vi.fn(() => "2026-08-10"),
}));
vi.mock("@/features/appointments/presentation/booking-workflow-detail", () => ({
  BookingWorkflowDetail: (props: Record<string, unknown>) => (
    <main data-testid="booking-workflow-detail" {...props} />
  ),
}));

import Page from "@/app/account/appointments/[bookingId]/page";

const bookingId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";

describe("appointment workflow detail page", () => {
  beforeEach(() => vi.clearAllMocks());

  it("protects and loads the booking projection using one settings read", async () => {
    const booking = { id: bookingId };
    repositories.getBusinessSettings.mockResolvedValueOnce({
      timezone: "Africa/Nairobi",
    });
    repositories.getBookingWorkflowDetail.mockResolvedValueOnce(booking);

    const element = await Page({
      params: Promise.resolve({ bookingId }),
    });

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.getBusinessSettings).toHaveBeenCalledOnce();
    expect(repositories.getBookingWorkflowDetail).toHaveBeenCalledWith(
      bookingId,
      "2026-08-10",
    );
    expect(element.props.booking).toBe(booking);
  });

  it("returns not found before repository access for an invalid ID", async () => {
    notFound.mockImplementationOnce(() => {
      throw new Error("not found");
    });

    await expect(
      Page({ params: Promise.resolve({ bookingId: "invalid" }) }),
    ).rejects.toThrow("not found");
    expect(repositories.getBookingWorkflowDetail).not.toHaveBeenCalled();
  });
});
