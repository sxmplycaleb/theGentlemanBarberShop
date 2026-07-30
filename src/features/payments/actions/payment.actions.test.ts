import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authProtect: vi.fn(),
  completeCheckout: vi.fn(),
  recordPayment: vi.fn(),
  recordRefund: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: { protect: mocks.authProtect },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/features/payments/data/payment.repository", () => ({
  completeCheckout: mocks.completeCheckout,
  recordPayment: mocks.recordPayment,
  recordRefund: mocks.recordRefund,
}));

import {
  completeCheckoutAction,
  recordPaymentAction,
  recordRefundAction,
} from "@/features/payments/actions/payment.actions";

const bookingId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";
const paymentId = "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77";

function form(entries: Record<string, string>) {
  const data = new FormData();
  Object.entries(entries).forEach(([key, value]) => data.set(key, value));
  return data;
}

const common = {
  booking_id: bookingId,
  currency_code: "KES",
  payment_date: "2020-07-30T09:30",
  payment_method: "mpesa",
  reference_number: "REF-1",
};

describe("payment actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authProtect.mockResolvedValue({ userId: "user_123" });
  });

  it("protects, validates, records a payment, and revalidates", async () => {
    mocks.recordPayment.mockResolvedValue(paymentId);
    await expect(
      recordPaymentAction(
        { success: false },
        form({ ...common, amount: "100.00" }),
      ),
    ).resolves.toMatchObject({
      paymentId,
      success: true,
    });
    expect(mocks.authProtect).toHaveBeenCalledOnce();
    expect(mocks.recordPayment).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 10_000 }),
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/account/payments");
  });

  it("completes checkout without accepting a client amount", async () => {
    mocks.completeCheckout.mockResolvedValue(paymentId);
    await expect(
      completeCheckoutAction({ success: false }, form(common)),
    ).resolves.toMatchObject({
      message: "Checkout completed.",
      success: true,
    });
    expect(mocks.completeCheckout).toHaveBeenCalledWith(
      expect.not.objectContaining({ amount: expect.anything() }),
    );
  });

  it("records a strictly validated refund", async () => {
    mocks.recordRefund.mockResolvedValue("refund-id");
    await expect(
      recordRefundAction(
        { success: false },
        form({
          ...common,
          amount: "25.00",
          original_payment_id: paymentId,
          refund_reason: "Customer request",
        }),
      ),
    ).resolves.toMatchObject({
      message: "Refund recorded.",
      success: true,
    });
    expect(mocks.recordRefund).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 2_500,
        original_payment_id: paymentId,
      }),
    );
  });

  it("rejects invalid and unknown input without repository access", async () => {
    const result = await recordPaymentAction(
      { success: false },
      form({ ...common, amount: "1.001", unexpected: "value" }),
    );
    expect(result).toMatchObject({ success: false });
    expect(mocks.recordPayment).not.toHaveBeenCalled();
    expect(mocks.authProtect).toHaveBeenCalledOnce();
  });

  it("preserves safe failures and hides unexpected errors", async () => {
    mocks.recordPayment.mockRejectedValue(
      new Error(
        "Payment exceeds the outstanding balance. Refresh and try again.",
      ),
    );
    await expect(
      recordPaymentAction(
        { success: false },
        form({ ...common, amount: "10" }),
      ),
    ).resolves.toMatchObject({
      message:
        "Payment exceeds the outstanding balance. Refresh and try again.",
      success: false,
    });

    mocks.recordRefund.mockRejectedValue(new Error("raw database detail"));
    await expect(
      recordRefundAction(
        { success: false },
        form({
          ...common,
          amount: "10",
          original_payment_id: paymentId,
          refund_reason: "Reason",
        }),
      ),
    ).resolves.toMatchObject({
      message: "Refund could not be recorded.",
      success: false,
    });
  });
});
