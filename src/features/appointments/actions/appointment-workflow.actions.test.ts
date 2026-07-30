import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getBusinessSettings: vi.fn(),
  protect: vi.fn(),
  revalidatePath: vi.fn(),
  transition: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: { protect: mocks.protect } }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock(
  "@/features/business-settings/data/business-settings.repository",
  () => ({
    getBusinessSettings: mocks.getBusinessSettings,
  }),
);
vi.mock("@/features/appointments/data/booking-workflow.repository", () => ({
  transitionBookingStatus: mocks.transition,
}));

import { transitionBookingStatusAction } from "@/features/appointments/actions/appointment-workflow.actions";

function data(overrides: Record<string, string> = {}) {
  const form = new FormData();
  Object.entries({
    booking_id: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
    expected_status: "pending",
    target_status: "confirmed",
    ...overrides,
  }).forEach(([key, value]) => form.set(key, value));
  return form;
}

describe("transitionBookingStatusAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getBusinessSettings.mockResolvedValue({
      timezone: "Africa/Nairobi",
    });
  });

  it("protects, validates, transitions, and revalidates", async () => {
    await expect(
      transitionBookingStatusAction({ success: false }, data()),
    ).resolves.toEqual({ message: "Booking status updated.", success: true });
    expect(mocks.protect).toHaveBeenCalledOnce();
    expect(mocks.transition).toHaveBeenCalledOnce();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/account/appointments");
  });

  it("rejects invalid input before reads", async () => {
    const result = await transitionBookingStatusAction(
      { success: false },
      data({ booking_id: "bad" }),
    );
    expect(result.success).toBe(false);
    expect(mocks.getBusinessSettings).not.toHaveBeenCalled();
  });

  it("returns stable repository failures", async () => {
    mocks.transition.mockRejectedValueOnce(
      new Error(
        "This booking has changed or the transition is no longer available. Refresh and try again.",
      ),
    );
    await expect(
      transitionBookingStatusAction({ success: false }, data()),
    ).resolves.toEqual({
      message:
        "This booking has changed or the transition is no longer available. Refresh and try again.",
      success: false,
    });
  });

  it("maps unexpected failures to the stable generic message", async () => {
    mocks.transition.mockRejectedValueOnce(new Error("raw internal failure"));
    await expect(
      transitionBookingStatusAction({ success: false }, data()),
    ).resolves.toEqual({
      message: "Booking status could not be updated.",
      success: false,
    });
  });
});
