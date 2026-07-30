import { describe, expect, it } from "vitest";

import { parseCustomerListFilters } from "@/features/customers/data/customer-management-filters";

describe("customer management filters", () => {
  it("uses safe defaults", () => {
    expect(parseCustomerListFilters({})).toEqual({
      active: "all",
      deleted: "not-deleted",
      direction: "asc",
      page: 1,
      pageSize: 10,
      search: "",
      sort: "full_name",
    });
  });

  it("parses supported filters and first duplicate values", () => {
    expect(
      parseCustomerListFilters({
        active: ["inactive", "active"],
        deleted: "all",
        direction: "desc",
        page: "3",
        search: [" alex ", "ignored"],
        sort: "updated_at",
      }),
    ).toEqual({
      active: "inactive",
      deleted: "all",
      direction: "desc",
      page: 3,
      pageSize: 10,
      search: "alex",
      sort: "updated_at",
    });
  });

  it("rejects unsupported values", () => {
    expect(
      parseCustomerListFilters({
        active: "archived",
        deleted: "gone",
        direction: "sideways",
        page: "-1",
        sort: "email",
      }),
    ).toMatchObject({
      active: "all",
      deleted: "not-deleted",
      direction: "asc",
      page: 1,
      sort: "full_name",
    });
  });
});
