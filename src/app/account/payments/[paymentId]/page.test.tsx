import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authProtect: vi.fn(),
  getPaymentDetail: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));
vi.mock("@clerk/nextjs/server", () => ({
  auth: { protect: mocks.authProtect },
}));
vi.mock("next/navigation", () => ({ notFound: mocks.notFound }));
vi.mock("@/features/payments/data/payment.repository", () => ({
  getPaymentDetail: mocks.getPaymentDetail,
}));
vi.mock("@/features/payments/actions/payment.actions", () => ({
  recordRefundAction: vi.fn(),
}));

import Page from "@/app/account/payments/[paymentId]/page";

const paymentId = "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77";

describe("payment detail page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authProtect.mockResolvedValue({ userId: "user_123" });
    mocks.getPaymentDetail.mockResolvedValue({
      payment: { id: paymentId },
      refundableAmountCents: 0,
      refunds: [],
      totals: {},
    });
  });

  it("protects, validates, and loads one payment detail", async () => {
    const element = await Page({
      params: Promise.resolve({ paymentId }),
    });
    expect(mocks.authProtect).toHaveBeenCalledOnce();
    expect(mocks.getPaymentDetail).toHaveBeenCalledWith(paymentId);
    expect(element.props.detail.payment.id).toBe(paymentId);
  });

  it("returns not found for invalid and missing payments", async () => {
    await expect(
      Page({ params: Promise.resolve({ paymentId: "invalid" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.getPaymentDetail).not.toHaveBeenCalled();

    mocks.getPaymentDetail.mockResolvedValue(null);
    await expect(
      Page({ params: Promise.resolve({ paymentId }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
