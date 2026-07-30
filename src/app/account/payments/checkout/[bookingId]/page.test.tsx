import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authProtect: vi.fn(),
  getCheckoutDetail: vi.fn(),
  listBookingPaymentHistory: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));
vi.mock("@clerk/nextjs/server", () => ({
  auth: { protect: mocks.authProtect },
}));
vi.mock("next/navigation", () => ({ notFound: mocks.notFound }));
vi.mock("@/features/payments/data/payment.repository", () => ({
  getCheckoutDetail: mocks.getCheckoutDetail,
  listBookingPaymentHistory: mocks.listBookingPaymentHistory,
}));
vi.mock("@/features/payments/actions/payment.actions", () => ({
  completeCheckoutAction: vi.fn(),
  recordPaymentAction: vi.fn(),
}));

import Page from "@/app/account/payments/checkout/[bookingId]/page";

const bookingId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";

describe("checkout page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authProtect.mockResolvedValue({ userId: "user_123" });
    mocks.getCheckoutDetail.mockResolvedValue({
      booking: { id: bookingId },
      totals: { booking_id: bookingId },
    });
    mocks.listBookingPaymentHistory.mockResolvedValue({
      data: [],
      pagination: { page: 2, pageCount: 2, pageSize: 10, total: 11 },
    });
  });

  it("protects and loads bounded checkout detail and history in parallel", async () => {
    const element = await Page({
      params: Promise.resolve({ bookingId }),
      searchParams: Promise.resolve({ history_page: "2" }),
    });
    expect(mocks.authProtect).toHaveBeenCalledOnce();
    expect(mocks.getCheckoutDetail).toHaveBeenCalledWith(bookingId);
    expect(mocks.listBookingPaymentHistory).toHaveBeenCalledWith(bookingId, 2);
    expect(element.props.historyPage).toBe(2);
  });

  it("returns not found before repository access for an invalid booking ID", async () => {
    await expect(
      Page({
        params: Promise.resolve({ bookingId: "invalid" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.getCheckoutDetail).not.toHaveBeenCalled();
  });
});
