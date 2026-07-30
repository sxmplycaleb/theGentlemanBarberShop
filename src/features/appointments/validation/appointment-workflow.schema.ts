import { z } from "zod";

import { bookingStatusSchema } from "@/features/bookings/validation/booking.schema";

export const bookingWorkflowIdSchema = z.object({ id: z.uuid() }).strict();

export const bookingTransitionSchema = z
  .object({
    booking_id: z.uuid(),
    expected_status: bookingStatusSchema,
    target_status: bookingStatusSchema,
  })
  .strict();

export type BookingTransitionValues = z.infer<typeof bookingTransitionSchema>;
