import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RefundForm } from "@/features/payments/presentation/refund-form";

describe("RefundForm", () => {
  it("renders refundable value, immutable identifiers, and accessible controls", () => {
    render(
      <RefundForm
        action={vi.fn()}
        bookingId="8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2"
        currencyCode="KES"
        defaultPaymentDate="2026-07-30T09:30"
        originalPaymentId="c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77"
        refundableAmountCents={5_000}
      />,
    );
    expect(screen.getByText(/Refundable:/)).toBeVisible();
    expect(screen.getByLabelText("Amount (KES)")).toBeVisible();
    expect(screen.getByLabelText("Administrative reason")).toBeVisible();
    expect(screen.getByRole("button", { name: "Record refund" })).toBeVisible();
  });

  it("announces a successful refund and links its receipt", async () => {
    const action = vi.fn().mockResolvedValue({
      message: "Refund recorded.",
      paymentId: "3bbc8fb4-f88b-491a-84f4-463b9cda4279",
      success: true,
    });
    render(
      <RefundForm
        action={action}
        bookingId="8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2"
        currencyCode="KES"
        defaultPaymentDate="2026-07-30T09:30"
        originalPaymentId="c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77"
        refundableAmountCents={5_000}
      />,
    );
    fireEvent.submit(
      screen.getByRole("button", { name: "Record refund" }).closest("form")!,
    );
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Refund recorded."),
    );
    expect(
      screen.getByRole("link", { name: "View refund receipt" }),
    ).toHaveAttribute(
      "href",
      "/account/payments/3bbc8fb4-f88b-491a-84f4-463b9cda4279",
    );
  });

  it("renders structured refund failures accessibly", async () => {
    const action = vi.fn().mockResolvedValue({
      errors: {
        amount: ["Invalid amount"],
        refund_reason: ["Enter a reason"],
      },
      message: "Check the highlighted fields.",
      success: false,
    });
    render(
      <RefundForm
        action={action}
        bookingId="8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2"
        currencyCode="KES"
        defaultPaymentDate="2026-07-30T09:30"
        originalPaymentId="c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77"
        refundableAmountCents={5_000}
      />,
    );
    fireEvent.submit(
      screen.getByRole("button", { name: "Record refund" }).closest("form")!,
    );
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Check the highlighted fields.",
      ),
    );
    expect(screen.getByText("Invalid amount")).toBeVisible();
    expect(screen.getByText("Enter a reason")).toBeVisible();
  });
});
