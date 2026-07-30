import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CustomerActionForm } from "@/features/customers/presentation/customer-action-form";
import type { ActionState } from "@/features/customers/types/customer-management.types";

describe("CustomerActionForm", () => {
  it("submits hidden fields and announces action feedback", async () => {
    const action = vi.fn(async (): Promise<ActionState> => ({
      message: "Customer restored.",
      success: true,
    }));
    const { container } = render(
      <CustomerActionForm
        action={action}
        fields={[{ name: "id", value: "customer_1" }]}
      >
        Restore
      </CustomerActionForm>,
    );

    expect(container.querySelector('input[name="id"]')).toHaveValue(
      "customer_1",
    );
    fireEvent.submit(
      screen.getByRole("button", { name: "Restore" }).closest("form")!,
    );
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Customer restored.",
      );
    });
  });

  it("announces failures as alerts", async () => {
    const action = vi.fn(async (): Promise<ActionState> => ({
      message: "Customer could not be restored.",
      success: false,
    }));
    render(
      <CustomerActionForm
        action={action}
        fields={[{ name: "id", value: "customer_1" }]}
      >
        Restore
      </CustomerActionForm>,
    );

    fireEvent.submit(
      screen.getByRole("button", { name: "Restore" }).closest("form")!,
    );
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeVisible();
    });
  });
});
