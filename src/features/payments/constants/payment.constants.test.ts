import { describe, expect, it } from "vitest";

import {
  PAYMENT_ENTRY_TYPES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  PAYMENT_SORT_FIELDS,
} from "@/features/payments/constants/payment.constants";

describe("payment constants", () => {
  it("defines the complete server-owned allow-lists", () => {
    expect(PAYMENT_METHODS).toEqual(["cash", "mpesa", "card", "bank_transfer"]);
    expect(PAYMENT_METHOD_LABELS.mpesa).toBe("M-Pesa");
    expect(PAYMENT_ENTRY_TYPES).toEqual(["payment", "refund"]);
    expect(PAYMENT_SORT_FIELDS).toContain("payment_date");
  });
});
