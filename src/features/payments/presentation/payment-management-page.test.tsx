import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="user-button" />,
}));

import { PaymentManagementPage } from "@/features/payments/presentation/payment-management-page";

const filters = {
  dateFrom: "",
  dateTo: "",
  direction: "desc" as const,
  entryType: "all" as const,
  method: "all" as const,
  page: 1,
  pageSize: 10,
  search: "",
  sort: "payment_date" as const,
};

describe("PaymentManagementPage", () => {
  it("renders the management shell, filters, and immutable-history guidance", () => {
    render(
      <PaymentManagementPage
        filters={filters}
        result={{
          data: [],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
        }}
        searchParams={{}}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Payment management" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Payment search")).toBeVisible();
    expect(
      screen.getByText(/Financial history remains immutable/),
    ).toBeVisible();
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });
});
