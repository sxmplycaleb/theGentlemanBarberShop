import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PaymentForm } from "@/features/payments/presentation/payment-form";

describe("PaymentForm", () => {
  it("renders separate partial and server-derived full checkout forms", () => {
    render(
      <PaymentForm
        bookingId="8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2"
        completeAction={vi.fn()}
        currencyCode="KES"
        defaultPaymentDate="2026-07-30T09:30"
        recordAction={vi.fn()}
      />,
    );
    expect(screen.getByText("Record partial payment")).toBeVisible();
    expect(screen.getByText("Full checkout")).toBeVisible();
    expect(screen.getByLabelText("Amount (KES)")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Complete checkout" }),
    ).toBeVisible();
    expect(screen.getAllByLabelText("Payment method")).toHaveLength(2);
  });

  it("announces structured partial-payment failures and full-checkout success", async () => {
    const recordAction = vi.fn().mockResolvedValue({
      errors: {
        amount: ["Invalid amount"],
        payment_date: ["Invalid date"],
        reference_number: ["Invalid reference"],
      },
      message: "Check the highlighted fields.",
      success: false,
    });
    const completeAction = vi.fn().mockResolvedValue({
      message: "Checkout completed.",
      paymentId: "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77",
      success: true,
    });
    render(
      <PaymentForm
        bookingId="8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2"
        completeAction={completeAction}
        currencyCode="KES"
        defaultPaymentDate="2026-07-30T09:30"
        recordAction={recordAction}
      />,
    );

    fireEvent.submit(
      screen.getByRole("button", { name: "Record payment" }).closest("form")!,
    );
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Check the highlighted fields.",
      ),
    );
    expect(screen.getByText("Invalid amount")).toBeVisible();
    expect(screen.getByText("Invalid date")).toBeVisible();
    expect(screen.getByText("Invalid reference")).toBeVisible();

    fireEvent.submit(
      screen
        .getByRole("button", { name: "Complete checkout" })
        .closest("form")!,
    );
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Checkout completed.",
      ),
    );
    expect(screen.getByRole("link", { name: "View receipt" })).toHaveAttribute(
      "href",
      "/account/payments/c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77",
    );
  });
});
