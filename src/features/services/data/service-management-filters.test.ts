import { describe, expect, it } from "vitest";

import {
  parseCategoryListFilters,
  parseServiceListFilters,
} from "@/features/services/data/service-management-filters";

describe("service management filters", () => {
  it("parses category filters with safe defaults", () => {
    expect(parseCategoryListFilters({})).toEqual({
      active: "all",
      deleted: "not-deleted",
      direction: "asc",
      page: 1,
      pageSize: 10,
      search: "",
      sort: "display_order",
    });
  });

  it("parses service filters from query values", () => {
    expect(
      parseServiceListFilters({
        s_active: "inactive",
        s_deleted: "all",
        s_direction: "desc",
        s_page: "3",
        s_search: " beard ",
        s_sort: "price_cents",
      }),
    ).toEqual({
      active: "inactive",
      deleted: "all",
      direction: "desc",
      page: 3,
      pageSize: 10,
      search: "beard",
      sort: "price_cents",
    });
  });

  it("rejects unsupported filter values", () => {
    expect(
      parseServiceListFilters({
        s_active: "archived",
        s_deleted: "gone",
        s_direction: "sideways",
        s_page: "-4",
        s_sort: "category",
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
