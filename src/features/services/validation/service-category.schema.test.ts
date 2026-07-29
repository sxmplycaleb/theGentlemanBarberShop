import { describe, expect, it } from "vitest";

import { serviceCategoryFormSchema } from "@/features/services/validation/service-category.schema";

describe("serviceCategoryFormSchema", () => {
  it("normalizes valid category form values", () => {
    const result = serviceCategoryFormSchema.parse({
      description: "  Grooming services  ",
      display_order: "2",
      is_active: "on",
      name: " Hair ",
      slug: "hair-services",
    });

    expect(result).toEqual({
      description: "Grooming services",
      display_order: 2,
      is_active: true,
      name: "Hair",
      slug: "hair-services",
    });
  });

  it("allows blank optional descriptions as null", () => {
    const result = serviceCategoryFormSchema.parse({
      description: " ",
      display_order: "0",
      is_active: undefined,
      name: "Hair",
      slug: "hair",
    });

    expect(result.description).toBeNull();
    expect(result.is_active).toBe(false);
  });

  it("rejects invalid slugs and negative ordering", () => {
    const result = serviceCategoryFormSchema.safeParse({
      description: "",
      display_order: "-1",
      is_active: "on",
      name: "",
      slug: "Hair Services",
    });

    expect(result.success).toBe(false);
  });
});
