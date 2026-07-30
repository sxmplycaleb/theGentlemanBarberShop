import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/customers/actions/customer.actions", () => ({
  restoreCustomerAction: vi.fn(),
  setCustomerActiveAction: vi.fn(),
  softDeleteCustomerAction: vi.fn(),
}));

vi.mock("@/features/customers/presentation/customer-action-form", () => ({
  CustomerActionForm: (props: {
    readonly children: React.ReactNode;
    readonly fields: readonly {
      readonly name: string;
      readonly value: string;
    }[];
  }) => (
    <form data-fields={JSON.stringify(props.fields)}>
      <button type="submit">{props.children}</button>
    </form>
  ),
}));

import { CustomerList } from "@/features/customers/presentation/customer-list";
import type {
  CustomerListFilters,
  CustomerRow,
} from "@/features/customers/types/customer-management.types";

const filters: CustomerListFilters = {
  active: "all",
  deleted: "not-deleted",
  direction: "asc",
  page: 1,
  pageSize: 10,
  search: "",
  sort: "full_name",
};

const currentCustomer: CustomerRow = {
  created_at: "2026-07-30T00:00:00.000Z",
  deleted_at: null,
  email: "alex@example.com",
  full_name: "Alex Mwangi",
  id: "customer_1",
  is_active: true,
  notes: "Regular customer",
  phone_number: "+254700000000",
  updated_at: "2026-07-30T00:00:00.000Z",
};

function renderList(data: readonly CustomerRow[]) {
  return render(
    <CustomerList
      filters={filters}
      result={{
        data,
        pagination: { page: 1, pageCount: 1, pageSize: 10, total: data.length },
      }}
      searchParams={{ search: "alex" }}
    />,
  );
}

describe("CustomerList", () => {
  it("renders current customer data, controls, and actions", () => {
    renderList([currentCustomer]);

    expect(screen.getByRole("heading", { name: "Customers" })).toBeVisible();
    expect(screen.getByPlaceholderText(/name, phone, or email/i)).toBeVisible();
    expect(screen.getByText("Alex Mwangi")).toBeVisible();
    expect(screen.getByText("+254700000000")).toBeVisible();
    expect(screen.getByText("alex@example.com")).toBeVisible();
    expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute(
      "href",
      "/account/customers/customer_1/edit",
    );
    expect(screen.getByRole("button", { name: "Deactivate" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
  });

  it("renders deleted customers with restore only", () => {
    renderList([
      {
        ...currentCustomer,
        deleted_at: "2026-07-30T01:00:00.000Z",
        email: null,
        notes: null,
        phone_number: null,
      },
    ]);

    expect(screen.getAllByText("Deleted")).toHaveLength(2);
    expect(screen.getAllByText("None")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Restore" })).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "Edit" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });

  it("renders an empty state", () => {
    renderList([]);
    expect(
      screen.getByText("No customers match the current filters."),
    ).toBeVisible();
  });
});
