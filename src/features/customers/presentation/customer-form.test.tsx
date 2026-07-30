import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CustomerForm } from "@/features/customers/presentation/customer-form";
import type {
  ActionState,
  CustomerRow,
} from "@/features/customers/types/customer-management.types";

const customer: CustomerRow = {
  created_at: "2026-07-30T00:00:00.000Z",
  deleted_at: null,
  email: "alex@example.com",
  full_name: "Alex Mwangi",
  id: "customer_1",
  is_active: false,
  notes: "Regular customer",
  phone_number: "+254700000000",
  updated_at: "2026-07-30T00:00:00.000Z",
};

describe("CustomerForm", () => {
  it("renders existing values and navigation", () => {
    const action = vi.fn(async (): Promise<ActionState> => ({ success: true }));
    render(
      <CustomerForm
        action={action}
        customer={customer}
        submitLabel="Update customer"
      />,
    );

    expect(screen.getByLabelText("Full name")).toHaveValue("Alex Mwangi");
    expect(screen.getByLabelText("Phone number")).toHaveValue("+254700000000");
    expect(screen.getByLabelText("Email")).toHaveValue("alex@example.com");
    expect(screen.getByLabelText("Notes")).toHaveValue("Regular customer");
    expect(screen.getByLabelText("Active")).not.toBeChecked();
    expect(
      screen.getByRole("link", { name: "Back to customers" }),
    ).toHaveAttribute("href", "/account/customers");
  });

  it("defaults new customers to active", () => {
    const action = vi.fn(async (): Promise<ActionState> => ({ success: true }));
    render(<CustomerForm action={action} submitLabel="Create customer" />);
    expect(screen.getByLabelText("Active")).toBeChecked();
  });

  it("renders structured action errors accessibly", async () => {
    const action = vi.fn(async (): Promise<ActionState> => ({
      errors: {
        email: ["Enter a valid email address."],
        full_name: ["Enter a full name."],
      },
      message: "Check the highlighted fields.",
      success: false,
    }));
    render(<CustomerForm action={action} submitLabel="Create customer" />);

    fireEvent.submit(
      screen.getByRole("button", { name: "Create customer" }).closest("form")!,
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Check the highlighted fields.",
      );
    });
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByText("Enter a full name.")).toHaveAttribute(
      "id",
      "full_name-error",
    );
  });
});
