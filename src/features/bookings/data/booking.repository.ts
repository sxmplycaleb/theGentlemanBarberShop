import "server-only";

import type {
  BookingCustomer,
  BookingListFilters,
  BookingRow,
  BookingSelectionOptions,
  BookingService,
  BookingStaff,
  BookingStatus,
  BookingSupabaseClient,
  BookingWithRelations,
  PaginatedResult,
} from "@/features/bookings/types/booking-management.types";
import type { BookingFormValues } from "@/features/bookings/validation/booking.schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bookingColumns =
  "booking_date,created_at,customer_id,deleted_at,id,service_id,staff_id,start_time,status,updated_at";
const bookingWithRelationsColumns = `${bookingColumns},customer:customers!bookings_customer_id_fkey(id,full_name,is_active,deleted_at),service:services!bookings_service_id_fkey(id,name,is_active,deleted_at),staff:staff!bookings_staff_id_fkey(id,display_name,is_active,deleted_at)`;
const slotConflictMessage =
  "That staff member already has a booking at this exact start time.";

function getBookingManagementClient() {
  return createSupabaseServerClient({
    serviceRole: true,
  }) as unknown as BookingSupabaseClient;
}

function getPaginationRange(page: number, pageSize: number) {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

function escapeSearchTerm(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_");
}

function databaseError(error: {
  readonly code?: string;
  readonly message: string;
}) {
  if (
    error.code === "23505" ||
    error.message.includes("bookings_current_staff_slot_unique_idx")
  ) {
    return new Error(slotConflictMessage);
  }

  if (error.code === "23503") {
    return new Error("Choose existing customer, staff, and service records.");
  }

  return new Error("Booking data could not be saved.");
}

function assertMutation(
  data: { readonly id: string } | null,
  error: { readonly code?: string; readonly message: string } | null,
  message: string,
) {
  if (error) {
    throw databaseError(error);
  }

  if (!data) {
    throw new Error(message);
  }
}

function mapBooking(row: unknown): BookingWithRelations {
  return row as BookingWithRelations;
}

async function findSearchReferenceIds(
  client: BookingSupabaseClient,
  search: string,
) {
  const term = escapeSearchTerm(search);
  const pattern = `%${term}%`;
  const [customers, staff, services] = await Promise.all([
    client.from("customers").select("id").ilike("full_name", pattern),
    client.from("staff").select("id").ilike("display_name", pattern),
    client.from("services").select("id").ilike("name", pattern),
  ]);

  if (customers.error || staff.error || services.error) {
    throw new Error("Bookings could not be loaded.");
  }

  return {
    customerIds: (customers.data ?? []).map((row) => row.id),
    serviceIds: (services.data ?? []).map((row) => row.id),
    staffIds: (staff.data ?? []).map((row) => row.id),
  };
}

function buildSearchFilter(
  search: string,
  ids: {
    readonly customerIds: readonly string[];
    readonly serviceIds: readonly string[];
    readonly staffIds: readonly string[];
  },
) {
  const clauses: string[] = [];

  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      search,
    )
  ) {
    clauses.push(`id.eq.${search}`);
  }

  if (ids.customerIds.length) {
    clauses.push(`customer_id.in.(${ids.customerIds.join(",")})`);
  }

  if (ids.staffIds.length) {
    clauses.push(`staff_id.in.(${ids.staffIds.join(",")})`);
  }

  if (ids.serviceIds.length) {
    clauses.push(`service_id.in.(${ids.serviceIds.join(",")})`);
  }

  return clauses.join(",");
}

export async function listBookings(
  filters: BookingListFilters,
): Promise<PaginatedResult<BookingWithRelations>> {
  const client = getBookingManagementClient();
  const { from, to } = getPaginationRange(filters.page, filters.pageSize);
  let searchFilter = "";

  if (filters.search) {
    const referenceIds = await findSearchReferenceIds(client, filters.search);
    searchFilter = buildSearchFilter(filters.search, referenceIds);

    if (!searchFilter) {
      return {
        data: [],
        pagination: {
          page: filters.page,
          pageCount: 1,
          pageSize: filters.pageSize,
          total: 0,
        },
      };
    }
  }

  let query = client
    .from("bookings")
    .select(bookingWithRelationsColumns, { count: "exact" });

  if (searchFilter) {
    query = query.or(searchFilter);
  }

  if (filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.customerId) {
    query = query.eq("customer_id", filters.customerId);
  }

  if (filters.staffId) {
    query = query.eq("staff_id", filters.staffId);
  }

  if (filters.serviceId) {
    query = query.eq("service_id", filters.serviceId);
  }

  if (filters.dateFrom) {
    query = query.gte("booking_date", filters.dateFrom);
  }

  if (filters.dateTo) {
    query = query.lte("booking_date", filters.dateTo);
  }

  if (filters.deleted === "deleted") {
    query = query.not("deleted_at", "is", null);
  } else if (filters.deleted === "not-deleted") {
    query = query.is("deleted_at", null);
  }

  const { count, data, error } = await query
    .order(filters.sort, { ascending: filters.direction === "asc" })
    .order("start_time", { ascending: filters.direction === "asc" })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error("Bookings could not be loaded.");
  }

  const total = count ?? 0;
  return {
    data: (data ?? []).map(mapBooking),
    pagination: {
      page: filters.page,
      pageCount: Math.max(1, Math.ceil(total / filters.pageSize)),
      pageSize: filters.pageSize,
      total,
    },
  };
}

export async function getBookingById(id: string) {
  const client = getBookingManagementClient();
  const { data, error } = await client
    .from("bookings")
    .select(bookingWithRelationsColumns)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Booking could not be loaded.");
  }

  return data ? mapBooking(data) : null;
}

function selectionQueryFilter(currentId: string | undefined) {
  return currentId
    ? `and(is_active.eq.true,deleted_at.is.null),id.eq.${currentId}`
    : "and(is_active.eq.true,deleted_at.is.null)";
}

export async function listBookingSelectionOptions(current?: {
  readonly customerId: string;
  readonly serviceId: string;
  readonly staffId: string;
}): Promise<BookingSelectionOptions> {
  const client = getBookingManagementClient();
  const [customers, staff, services] = await Promise.all([
    client
      .from("customers")
      .select("id,full_name,is_active,deleted_at")
      .or(selectionQueryFilter(current?.customerId))
      .order("full_name"),
    client
      .from("staff")
      .select("id,display_name,is_active,deleted_at")
      .or(selectionQueryFilter(current?.staffId))
      .order("display_name"),
    client
      .from("services")
      .select("id,name,is_active,deleted_at")
      .or(selectionQueryFilter(current?.serviceId))
      .order("name"),
  ]);

  if (customers.error || staff.error || services.error) {
    throw new Error("Booking selections could not be loaded.");
  }

  return {
    customers: (customers.data ?? []) as readonly BookingCustomer[],
    services: (services.data ?? []) as readonly BookingService[],
    staff: (staff.data ?? []) as readonly BookingStaff[],
  };
}

async function readBookingRow(client: BookingSupabaseClient, id: string) {
  const { data, error } = await client
    .from("bookings")
    .select(bookingColumns)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Booking could not be loaded.");
  }

  return data as BookingRow | null;
}

async function validateReference(
  client: BookingSupabaseClient,
  table: "customers" | "services" | "staff",
  id: string,
  currentId?: string,
) {
  const { data, error } = await client
    .from(table)
    .select("id,is_active,deleted_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Choose existing customer, staff, and service records.");
  }

  if (id !== currentId && (!data.is_active || data.deleted_at)) {
    throw new Error(
      "Choose active, non-deleted customer, staff, and service records.",
    );
  }
}

async function validateReferences(
  client: BookingSupabaseClient,
  values: BookingFormValues,
  current?: BookingRow,
) {
  await Promise.all([
    validateReference(
      client,
      "customers",
      values.customer_id,
      current?.customer_id,
    ),
    validateReference(client, "staff", values.staff_id, current?.staff_id),
    validateReference(
      client,
      "services",
      values.service_id,
      current?.service_id,
    ),
  ]);
}

async function ensureSlotAvailable(
  client: BookingSupabaseClient,
  values: Pick<
    BookingFormValues,
    "booking_date" | "staff_id" | "start_time" | "status"
  >,
  excludeId?: string,
) {
  if (values.status === "cancelled") {
    return;
  }

  let query = client
    .from("bookings")
    .select("id")
    .eq("staff_id", values.staff_id)
    .eq("booking_date", values.booking_date)
    .eq("start_time", values.start_time)
    .neq("status", "cancelled")
    .is("deleted_at", null);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    throw new Error("Booking availability could not be validated.");
  }

  if (data) {
    throw new Error(slotConflictMessage);
  }
}

export async function createBooking(values: BookingFormValues) {
  const client = getBookingManagementClient();
  await validateReferences(client, values);
  await ensureSlotAvailable(client, values);
  const { data, error } = await client
    .from("bookings")
    .insert(values)
    .select("id")
    .single();
  assertMutation(data, error, "Booking could not be created.");
}

export async function updateBooking(id: string, values: BookingFormValues) {
  const client = getBookingManagementClient();
  const current = await readBookingRow(client, id);

  if (!current || current.deleted_at) {
    throw new Error("Only current bookings can be updated.");
  }

  await validateReferences(client, values, current);
  await ensureSlotAvailable(client, values, id);
  const { data, error } = await client
    .from("bookings")
    .update(values)
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();
  assertMutation(data, error, "Booking could not be updated.");
}

export async function setBookingStatus(id: string, status: BookingStatus) {
  const client = getBookingManagementClient();
  const current = await readBookingRow(client, id);

  if (!current || current.deleted_at) {
    throw new Error("Only current bookings can change status.");
  }

  await ensureSlotAvailable(client, { ...current, status }, id);
  const { data, error } = await client
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();
  assertMutation(data, error, "Booking status could not be updated.");
}

export async function softDeleteBooking(id: string) {
  const client = getBookingManagementClient();
  const { data, error } = await client
    .from("bookings")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();
  assertMutation(data, error, "Booking could not be deleted.");
}

export async function restoreBooking(id: string) {
  const client = getBookingManagementClient();
  const current = await readBookingRow(client, id);

  if (!current?.deleted_at) {
    throw new Error("Only deleted bookings can be restored.");
  }

  await validateReferences(client, current, current);
  await ensureSlotAvailable(client, current, id);
  const { data, error } = await client
    .from("bookings")
    .update({ deleted_at: null })
    .eq("id", id)
    .not("deleted_at", "is", null)
    .select("id")
    .maybeSingle();
  assertMutation(data, error, "Booking could not be restored.");
}
