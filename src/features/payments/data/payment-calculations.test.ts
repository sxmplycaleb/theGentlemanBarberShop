import { describe, expect, it } from "vitest";

import {
  calculateNetPaid,
  calculateOutstandingBalance,
  calculateRefundableAmount,
  formatCurrency,
} from "@/features/payments/data/payment-calculations";

describe("payment calculations", () => {
  it("derives net paid and outstanding balances without storing totals", () => {
    expect(calculateNetPaid(10_000, 2_500)).toBe(7_500);
    expect(calculateOutstandingBalance(12_000, 7_500)).toBe(4_500);
    expect(calculateOutstandingBalance(12_000, 15_000)).toBe(0);
  });

  it("derives refundable amounts without negative values", () => {
    expect(calculateRefundableAmount(10_000, 2_500)).toBe(7_500);
    expect(calculateRefundableAmount(10_000, 12_000)).toBe(0);
  });

  it("formats integer cents with the supplied currency", () => {
    expect(formatCurrency(125_050, "KES")).toContain("1,250.50");
  });
});
