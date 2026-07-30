import "server-only";

import {
  getAvailableBookingTransitions,
  isBookingStatusTransitionAllowed,
} from "@/features/bookings/constants/booking-status-transitions";
import type {
  BookingStaff,
  BookingSupabaseClient,
  BookingWithRelations,
} from "@/features/bookings/types/booking-management.types";
import type {
  BookingWorkflowFilters,
  BookingWorkflowOptions,
  BookingWorkflowProjection,
  BookingWorkflowResult,
} from "@/features/appointments/types/booking-workflow.types";
import {
  bookingWorkflowIdSchema,
  type BookingTransitionValues,
} from "@/features/appointments/validation/appointment-workflow.schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const columns =
  "booking_date,created_at,customer_id,deleted_at,id,service_id,staff_id,start_time,status,updated_at,customer:customers!bookings_customer_id_fkey(id,full_name,is_active,deleted_at),customer_search:customers!bookings_customer_id_fkey(),service:services!bookings_service_id_fkey(id,name,is_active,deleted_at),service_search:services!bookings_service_id_fkey(),staff:staff!bookings_staff_id_fkey(id,display_name,is_active,deleted_at),staff_search:staff!bookings_staff_id_fkey()";
const staleMessage =
  "This booking has changed or the transition is no longer available. Refresh and try again.";

function client() {
  return createSupabaseServerClient({
    serviceRole: true,
  }) as unknown as BookingSupabaseClient;
}

function projectBooking(
  row: unknown,
  businessDate: string,
): BookingWorkflowProjection {
  const booking = row as BookingWithRelations;
  return {
    ...booking,
    availableTransitions: getAvailableBookingTransitions(
      booking.status,
      booking.booking_date,
      businessDate,
    ),
  };
}

export async function listBookingWorkflowQueue(
  filters: BookingWorkflowFilters,
  businessDate: string,
): Promise<BookingWorkflowResult> {
  const from = (filters.page - 1) * filters.pageSize;
  let query = client()
    .from("bookings")
    .select(columns, { count: "exact" })
    .eq("booking_date", filters.bookingDate)
    .is("deleted_at", null);

  if (filters.staffId) query = query.eq("staff_id", filters.staffId);
  if (filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.search) {
    const pattern = `%${filters.search.replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
    const searchPredicates = [
      "customer_search.not.is.null",
      "staff_search.not.is.null",
      "service_search.not.is.null",
    ];
    if (bookingWorkflowIdSchema.safeParse({ id: filters.search }).success) {
      searchPredicates.push(`id.eq.${filters.search}`);
    }
    query = query
      .ilike("customer_search.full_name", pattern)
      .ilike("staff_search.display_name", pattern)
      .ilike("service_search.name", pattern)
      .or(searchPredicates.join(","));
  }

  const { count, data, error } = await query
    .order(filters.sort, { ascending: filters.direction === "asc" })
    .order("id", { ascending: true })
    .range(from, from + filters.pageSize - 1);

  if (error) throw new Error("Appointments could not be loaded.");
  const total = count ?? 0;
  return {
    data: (data ?? []).map((row) => projectBooking(row, businessDate)),
    pagination: {
      page: filters.page,
      pageCount: Math.max(1, Math.ceil(total / filters.pageSize)),
      pageSize: filters.pageSize,
      total,
    },
  };
}

export async function getBookingWorkflowDetail(
  id: string,
  businessDate: string,
) {
  const { data, error } = await client()
    .from("bookings")
    .select(columns)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error("Appointment details could not be loaded.");
  return data ? projectBooking(data, businessDate) : null;
}

export async function listBookingWorkflowOptions(): Promise<BookingWorkflowOptions> {
  const { data, error } = await client()
    .from("staff")
    .select("id,display_name,is_active,deleted_at")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("display_name");

  if (error) throw new Error("Appointment filters could not be loaded.");
  return { staff: (data ?? []) as readonly BookingStaff[] };
}

export async function transitionBookingStatus(
  values: BookingTransitionValues,
  businessDate: string,
) {
  if (
    !isBookingStatusTransitionAllowed(
      values.expected_status,
      values.target_status,
    )
  ) {
    throw new Error("That booking status transition is not allowed.");
  }

  let query = client()
    .from("bookings")
    .update({ status: values.target_status })
    .eq("id", values.booking_id)
    .eq("status", values.expected_status)
    .is("deleted_at", null);

  if (values.target_status === "confirmed") {
    query = query.gte("booking_date", businessDate);
  } else if (
    values.target_status === "completed" ||
    values.target_status === "no_show"
  ) {
    query = query.lte("booking_date", businessDate);
  }

  const { data, error } = await query.select("id").maybeSingle();
  if (error) throw new Error("Booking status could not be updated.");
  if (!data) throw new Error(staleMessage);
}
