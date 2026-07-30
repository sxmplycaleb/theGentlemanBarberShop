import { z } from "zod";

import {
  BOOKING_STATUSES,
  type BookingListFilters,
  type BookingManagementSearchParams,
  type BookingSortField,
} from "@/features/bookings/types/booking-management.types";

const PAGE_SIZE = 10;
const uuidSchema = z.uuid();
const dateSchema = z.iso.date();
const sortFields = new Set<BookingSortField>([
  "booking_date",
  "created_at",
  "start_time",
  "status",
  "updated_at",
]);

function readSingle(value: string | readonly string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function parsePage(value: string | readonly string[] | undefined) {
  const page = Number.parseInt(readSingle(value), 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseUuid(value: string | readonly string[] | undefined) {
  const parsed = uuidSchema.safeParse(readSingle(value));
  return parsed.success ? parsed.data : "";
}

function parseDate(value: string | readonly string[] | undefined) {
  const parsed = dateSchema.safeParse(readSingle(value));
  return parsed.success ? parsed.data : "";
}

export function parseBookingListFilters(
  searchParams: BookingManagementSearchParams,
): BookingListFilters {
  let dateFrom = parseDate(searchParams.date_from);
  let dateTo = parseDate(searchParams.date_to);

  if (dateFrom && dateTo && dateFrom > dateTo) {
    dateFrom = "";
    dateTo = "";
  }

  const statusValue = readSingle(searchParams.status);
  const status = BOOKING_STATUSES.includes(
    statusValue as (typeof BOOKING_STATUSES)[number],
  )
    ? (statusValue as (typeof BOOKING_STATUSES)[number])
    : "all";
  const sortValue = readSingle(searchParams.sort);
  const sort = sortFields.has(sortValue as BookingSortField)
    ? (sortValue as BookingSortField)
    : "booking_date";
  const deletedValue = readSingle(searchParams.deleted);

  return {
    customerId: parseUuid(searchParams.customer),
    dateFrom,
    dateTo,
    deleted:
      deletedValue === "deleted" || deletedValue === "all"
        ? deletedValue
        : "not-deleted",
    direction: readSingle(searchParams.direction) === "desc" ? "desc" : "asc",
    page: parsePage(searchParams.page),
    pageSize: PAGE_SIZE,
    search: readSingle(searchParams.search).trim(),
    serviceId: parseUuid(searchParams.service),
    sort,
    staffId: parseUuid(searchParams.staff),
    status,
  };
}
