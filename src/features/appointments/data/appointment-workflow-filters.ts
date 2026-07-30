import { z } from "zod";

import type {
  BookingWorkflowFilters,
  BookingWorkflowSearchParams,
} from "@/features/appointments/types/booking-workflow.types";
import { BOOKING_STATUSES } from "@/features/bookings/types/booking-management.types";

const PAGE_SIZE = 10;
const uuidSchema = z.uuid();
const dateSchema = z.iso.date();

function single(value: string | readonly string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function parseBookingWorkflowFilters(
  params: BookingWorkflowSearchParams,
  businessDate: string,
): BookingWorkflowFilters {
  const date = dateSchema.safeParse(single(params.date));
  const staff = uuidSchema.safeParse(single(params.staff));
  const page = Number.parseInt(single(params.page), 10);
  const statusValue = single(params.status);
  const status = BOOKING_STATUSES.includes(
    statusValue as (typeof BOOKING_STATUSES)[number],
  )
    ? (statusValue as (typeof BOOKING_STATUSES)[number])
    : "all";

  return {
    bookingDate: date.success ? date.data : businessDate,
    direction: single(params.direction) === "desc" ? "desc" : "asc",
    page: Number.isInteger(page) && page > 0 ? page : 1,
    pageSize: PAGE_SIZE,
    search: single(params.search).trim(),
    sort: single(params.sort) === "status" ? "status" : "start_time",
    staffId: staff.success ? staff.data : "",
    status,
  };
}
