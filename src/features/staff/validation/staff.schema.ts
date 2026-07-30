import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Use lowercase letters, numbers, and single hyphens.",
  });

const optionalTextSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}, z.string().min(1).nullable());

const checkboxBooleanSchema = z.preprocess(
  (value) => value === "on" || value === "true" || value === true,
  z.boolean(),
);

const nonNegativeIntegerSchema = z.coerce
  .number()
  .int()
  .min(0, "Enter a non-negative whole number.");

export const staffFormSchema = z.object({
  bio: optionalTextSchema,
  display_name: z.string().trim().min(1, "Enter a display name."),
  display_order: nonNegativeIntegerSchema,
  is_active: checkboxBooleanSchema,
  phone_number: optionalTextSchema,
  slug: slugSchema,
});

export const staffIdSchema = z.object({
  id: z.uuid(),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
