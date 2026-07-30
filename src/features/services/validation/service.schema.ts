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

const optionalUrlSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}, z.url("Enter a valid image URL.").nullable());

const checkboxBooleanSchema = z.preprocess(
  (value) => value === "on" || value === "true" || value === true,
  z.boolean(),
);

const nonNegativeIntegerSchema = z.coerce
  .number()
  .int()
  .min(0, "Enter a non-negative whole number.");

export const serviceFormSchema = z.object({
  category_id: z.uuid("Choose a service category."),
  description: optionalTextSchema,
  display_order: nonNegativeIntegerSchema,
  duration_minutes: z.coerce
    .number()
    .int()
    .min(1, "Enter a duration of at least 1 minute."),
  image_url: optionalUrlSchema,
  is_active: checkboxBooleanSchema,
  name: z.string().trim().min(1, "Enter a service name."),
  price_cents: nonNegativeIntegerSchema,
  slug: slugSchema,
});

export const serviceIdSchema = z.object({
  id: z.uuid(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
