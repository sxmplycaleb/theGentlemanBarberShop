import { describe, expect, it } from "vitest";

import { staffFormSchema } from "@/features/staff/validation/staff.schema";

describe("staffFormSchema", () => {
  it("normalizes valid staff form values", () => {
    const result = staffFormSchema.parse({
      bio: "  Senior barber  ",
      display_name: "  Alex Mwangi  ",
      display_order: "3",
      is_active: "on",
      phone_number: "  +254700000000  ",
      slug: "alex-mwangi",
    });

    expect(result).toEqual({
      bio: "Senior barber",
      display_name: "Alex Mwangi",
      display_order: 3,
      is_active: true,
      phone_number: "+254700000000",
      slug: "alex-mwangi",
    });
  });

  it("allows blank optional text values as null", () => {
    const result = staffFormSchema.parse({
      bio: "",
      display_name: "Alex",
      display_order: "0",
      is_active: undefined,
      phone_number: " ",
      slug: "alex",
    });

    expect(result.bio).toBeNull();
    expect(result.phone_number).toBeNull();
    expect(result.is_active).toBe(false);
  });

  it("rejects invalid staff values", () => {
    const result = staffFormSchema.safeParse({
      bio: "",
      display_name: "",
      display_order: "-1",
      is_active: "on",
      phone_number: "",
      slug: "Bad Slug",
    });

    expect(result.success).toBe(false);
  });
});
