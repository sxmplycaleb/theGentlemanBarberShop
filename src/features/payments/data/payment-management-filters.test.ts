import { describe, expect, it } from "vitest";

import {
  parsePaymentHistoryPage,
  parsePaymentListFilters,
} from "@/features/payments/data/payment-management-filters";

describe("payment filters", () => {
  it("uses safe payment-history defaults", () => {
    expect(parsePaymentListFilters({})).toMatchObject({
      direction: "desc",
      entryType: "all",
      method: "all",
      page: 1,
      pageSize: 10,
      sort: "payment_date",
    });
    expect(parsePaymentHistoryPage(undefined)).toBe(1);
  });

  it("accepts allow-listed filters and the first repeated value", () => {
    expect(
      parsePaymentListFilters({
        date_from: "2026-07-01",
        date_to: "2026-07-30",
        direction: "asc",
        entry_type: ["refund", "payment"],
        method: "mpesa",
        page: "3",
        search: "  Alex  ",
        sort: "amount_cents",
      }),
    ).toEqual({
      dateFrom: "2026-07-01",
      dateTo: "2026-07-30",
      direction: "asc",
      entryType: "refund",
      method: "mpesa",
      page: 3,
      pageSize: 10,
      search: "Alex",
      sort: "amount_cents",
    });
    expect(parsePaymentHistoryPage("4")).toBe(4);
  });

  it("rejects invalid ranges and unsupported values", () => {
    expect(
      parsePaymentListFilters({
        date_from: "2026-08-01",
        date_to: "2026-07-01",
        entry_type: "charge",
        method: "crypto",
        page: "-2",
        sort: "customer",
      }),
    ).toMatchObject({
      dateFrom: "",
      dateTo: "",
      entryType: "all",
      method: "all",
      page: 1,
      sort: "payment_date",
    });
  });
});
