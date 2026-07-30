import { z } from "zod";

import { BOOKING_STATUSES } from "@/features/bookings/types/booking-management.types";

function isCalendarDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (year === undefined || month === undefined || day === undefined) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a booking date.")
  .refine(isCalendarDate, "Enter a valid booking date.");

const timeSchema = z
  .string()
  .trim()
  .regex(
    /^(?:[01]\d|2[0-3]):[0-5]\d$/,
    "Enter a valid start time in 24-hour format.",
  );

export const bookingStatusSchema = z.enum(BOOKING_STATUSES);

export const bookingFormSchema = z
  .object({
    booking_date: dateSchema,
    customer_id: z.uuid("Choose a valid customer."),
    service_id: z.uuid("Choose a valid service."),
    staff_id: z.uuid("Choose a valid staff member."),
    start_time: timeSchema,
  })
  .strict();

export const bookingIdSchema = z
  .object({
    id: z.uuid(),
  })
  .strict();

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
