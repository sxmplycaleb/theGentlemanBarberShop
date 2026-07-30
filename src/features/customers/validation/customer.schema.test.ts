import { describe, expect, it } from "vitest";

import {
  customerFormSchema,
  customerIdSchema,
} from "@/features/customers/validation/customer.schema";

describe("customer validation", () => {
  it("normalizes valid customer values", () => {
    expect(
      customerFormSchema.parse({
        email: "  ALEX@EXAMPLE.COM ",
        full_name: "  Alex Mwangi ",
        is_active: "on",
        notes: "  Prefers morning visits ",
        phone_number: "  +254700000000 ",
      }),
    ).toEqual({
      email: "alex@example.com",
      full_name: "Alex Mwangi",
      is_active: true,
      notes: "Prefers morning visits",
      phone_number: "+254700000000",
    });
  });

  it("normalizes blank optional fields to null", () => {
    expect(
      customerFormSchema.parse({
        email: " ",
        full_name: "Alex",
        is_active: undefined,
        notes: "",
        phone_number: " ",
      }),
    ).toEqual({
      email: null,
      full_name: "Alex",
      is_active: false,
      notes: null,
      phone_number: null,
    });
  });

  it("rejects invalid, excessive, and unknown values", () => {
    const result = customerFormSchema.safeParse({
      email: "not-email",
      full_name: "",
      is_active: "on",
      notes: "n".repeat(2001),
      phone_number: "1".repeat(33),
      role: "admin",
    });

    expect(result.success).toBe(false);
  });

  it("validates customer UUIDs and rejects unknown fields", () => {
    expect(
      customerIdSchema.safeParse({
        id: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
      }).success,
    ).toBe(true);
    expect(customerIdSchema.safeParse({ id: "invalid" }).success).toBe(false);
    expect(
      customerIdSchema.safeParse({
        extra: "value",
        id: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
      }).success,
    ).toBe(false);
  });
});
