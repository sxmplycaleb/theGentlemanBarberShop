import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="user-button" />,
}));
vi.mock("@/features/customers/presentation/customer-list", () => ({
  CustomerList: () => <section data-testid="customer-list" />,
}));

import { CustomerFormPage } from "@/features/customers/presentation/customer-form-page";
import { CustomerManagementPage } from "@/features/customers/presentation/customer-management-page";

describe("customer page presentation", () => {
  it("renders the management shell", () => {
    render(
      <CustomerManagementPage
        filters={{
          active: "all",
          deleted: "not-deleted",
          direction: "asc",
          page: 1,
          pageSize: 10,
          search: "",
          sort: "full_name",
        }}
        result={{
          data: [],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
        }}
        searchParams={{}}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Customer management" }),
    ).toBeVisible();
    expect(screen.getByTestId("customer-list")).toBeVisible();
  });

  it("renders the form shell", () => {
    render(
      <CustomerFormPage title="New customer">
        <form>Customer form</form>
      </CustomerFormPage>,
    );
    expect(screen.getByRole("heading", { name: "New customer" })).toBeVisible();
    expect(screen.getByText("Customer form")).toBeVisible();
  });
});
