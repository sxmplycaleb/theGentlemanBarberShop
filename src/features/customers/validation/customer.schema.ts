import { z } from "zod";

function optionalTextSchema(maximum: number, message: string) {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, z.string().min(1).max(maximum, message).nullable());
}

const optionalEmailSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}, z.email("Enter a valid email address.").max(254, "Email must be 254 characters or fewer.").nullable());

const checkboxBooleanSchema = z.preprocess(
  (value) => value === "on" || value === "true" || value === true,
  z.boolean(),
);

export const customerFormSchema = z
  .object({
    email: optionalEmailSchema,
    full_name: z
      .string()
      .trim()
      .min(1, "Enter a full name.")
      .max(120, "Full name must be 120 characters or fewer."),
    is_active: checkboxBooleanSchema,
    notes: optionalTextSchema(2000, "Notes must be 2,000 characters or fewer."),
    phone_number: optionalTextSchema(
      32,
      "Phone number must be 32 characters or fewer.",
    ),
  })
  .strict();

export const customerIdSchema = z
  .object({
    id: z.uuid(),
  })
  .strict();

export const customerStatusSchema = customerIdSchema.extend({
  is_active: checkboxBooleanSchema,
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
