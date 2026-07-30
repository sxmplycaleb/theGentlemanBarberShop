import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/staff/actions/staff.actions", () => ({
  restoreStaffAction: vi.fn(),
  setStaffActiveAction: vi.fn(),
  softDeleteStaffAction: vi.fn(),
}));

vi.mock("@/features/staff/presentation/staff-action-form", () => ({
  StaffActionForm: (props: {
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

import { StaffList } from "@/features/staff/presentation/staff-list";
import type { StaffListFilters } from "@/features/staff/types/staff-management.types";

const filters: StaffListFilters = {
  active: "all",
  deleted: "not-deleted",
  direction: "asc",
  page: 1,
  pageSize: 10,
  search: "",
  sort: "display_order",
};

describe("StaffList", () => {
  it("renders staff rows with status and management actions", () => {
    render(
      <StaffList
        filters={filters}
        result={{
          data: [
            {
              bio: "Senior barber",
              created_at: "2026-07-30T00:00:00.000Z",
              deleted_at: null,
              display_name: "Alex Mwangi",
              display_order: 2,
              id: "staff_1",
              is_active: true,
              phone_number: "+254700000000",
              slug: "alex-mwangi",
              updated_at: "2026-07-30T00:00:00.000Z",
            },
          ],
          pagination: { page: 1, pageCount: 1, pageSize: 10, total: 1 },
        }}
        searchParams={{}}
      />,
    );

    expect(screen.getByRole("heading", { name: "Staff" })).toBeVisible();
    expect(screen.getByText("Alex Mwangi")).toBeVisible();
    expect(screen.getByText("alex-mwangi")).toBeVisible();
    expect(screen.getAllByText("Active").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute(
      "href",
      "/account/staff/staff_1/edit",
    );
    expect(screen.getByRole("button", { name: "Deactivate" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
  });
});
