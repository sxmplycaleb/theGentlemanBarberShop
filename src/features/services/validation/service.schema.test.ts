import { describe, expect, it } from "vitest";

import { serviceFormSchema } from "@/features/services/validation/service.schema";

const categoryId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";

describe("serviceFormSchema", () => {
  it("normalizes valid service form values", () => {
    const result = serviceFormSchema.parse({
      category_id: categoryId,
      description: "  Beard trim  ",
      display_order: "3",
      duration_minutes: "45",
      image_url: "https://example.com/beard.jpg",
      is_active: "on",
      name: " Beard Trim ",
      price_cents: "250000",
      slug: "beard-trim",
    });

    expect(result).toEqual({
      category_id: categoryId,
      description: "Beard trim",
      display_order: 3,
      duration_minutes: 45,
      image_url: "https://example.com/beard.jpg",
      is_active: true,
      name: "Beard Trim",
      price_cents: 250000,
      slug: "beard-trim",
    });
  });

  it("allows blank optional description and image URL as null", () => {
    const result = serviceFormSchema.parse({
      category_id: categoryId,
      description: "",
      display_order: "0",
      duration_minutes: "30",
      image_url: " ",
      is_active: undefined,
      name: "Cut",
      price_cents: "0",
      slug: "cut",
    });

    expect(result.description).toBeNull();
    expect(result.image_url).toBeNull();
    expect(result.is_active).toBe(false);
  });

  it("rejects invalid service values", () => {
    const result = serviceFormSchema.safeParse({
      category_id: "not-a-uuid",
      description: "",
      display_order: "-1",
      duration_minutes: "0",
      image_url: "not-a-url",
      is_active: "on",
      name: "",
      price_cents: "-1",
      slug: "Bad Slug",
    });

    expect(result.success).toBe(false);
  });
});
