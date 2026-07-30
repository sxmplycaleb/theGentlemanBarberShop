import { describe, expect, it } from "vitest";

import { parseStaffListFilters } from "@/features/staff/data/staff-management-filters";

describe("staff management filters", () => {
  it("parses staff filters with safe defaults", () => {
    expect(parseStaffListFilters({})).toEqual({
      active: "all",
      deleted: "not-deleted",
      direction: "asc",
      page: 1,
      pageSize: 10,
      search: "",
      sort: "display_order",
    });
  });

  it("parses staff filters from query values", () => {
    expect(
      parseStaffListFilters({
        active: "inactive",
        deleted: "all",
        direction: "desc",
        page: "3",
        search: " alex ",
        sort: "display_name",
      }),
    ).toEqual({
      active: "inactive",
      deleted: "all",
      direction: "desc",
      page: 3,
      pageSize: 10,
      search: "alex",
      sort: "display_name",
    });
  });

  it("rejects unsupported filter values", () => {
    expect(
      parseStaffListFilters({
        active: "archived",
        deleted: "gone",
        direction: "sideways",
        page: "-4",
        sort: "phone_number",
      }),
    ).toMatchObject({
      active: "all",
      deleted: "not-deleted",
      direction: "asc",
      page: 1,
      sort: "display_order",
    });
  });
});
