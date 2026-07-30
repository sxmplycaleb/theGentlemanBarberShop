import { beforeEach, describe, expect, it, vi } from "vitest";

const { createSupabaseServerClient } = vi.hoisted(() => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient }));

import {
  createBooking,
  getBookingById,
  listBookings,
  listBookingSelectionOptions,
  restoreBooking,
  softDeleteBooking,
  updateBooking,
} from "@/features/bookings/data/booking.repository";
import type { BookingListFilters } from "@/features/bookings/types/booking-management.types";

const ids = {
  booking: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
  customer: "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77",
  service: "3bbc8fb4-f88b-491a-84f4-463b9cda4279",
  staff: "c4651894-b328-4873-8ea9-66ca850bcf45",
};
const booking = {
  booking_date: "2026-08-10",
  created_at: "2026-07-30T00:00:00.000Z",
  customer_id: ids.customer,
  deleted_at: null,
  id: ids.booking,
  service_id: ids.service,
  staff_id: ids.staff,
  start_time: "09:30:00",
  status: "pending",
  updated_at: "2026-07-30T00:00:00.000Z",
} as const;
const values = {
  booking_date: booking.booking_date,
  customer_id: ids.customer,
  service_id: ids.service,
  staff_id: ids.staff,
  start_time: "09:30",
} as const;
const filters: BookingListFilters = {
  customerId: "",
  dateFrom: "",
  dateTo: "",
  deleted: "not-deleted",
  direction: "asc",
  page: 1,
  pageSize: 10,
  search: "",
  serviceId: "",
  sort: "booking_date",
  staffId: "",
  status: "all",
};

type Result = {
  readonly count?: number | null;
  readonly data: unknown;
  readonly error: { readonly code?: string; readonly message: string } | null;
};

function queryChain(table: string, result: Result, calls: string[]) {
  const chain: Record<string, ReturnType<typeof vi.fn> | unknown> = {};
  for (const method of [
    "eq",
    "gte",
    "ilike",
    "is",
    "limit",
    "lte",
    "neq",
    "not",
    "or",
    "order",
    "select",
  ]) {
    chain[method] = vi.fn((...args: unknown[]) => {
      calls.push(`${table}.${method}:${JSON.stringify(args)}`);
      return chain;
    });
  }
  chain.insert = vi.fn((...args: unknown[]) => {
    calls.push(`${table}.insert:${JSON.stringify(args)}`);
    return chain;
  });
  chain.update = vi.fn((...args: unknown[]) => {
    calls.push(`${table}.update:${JSON.stringify(args)}`);
    return chain;
  });
  chain.range = vi.fn(async (...args: unknown[]) => {
    calls.push(`${table}.range:${JSON.stringify(args)}`);
    return result;
  });
  chain.maybeSingle = vi.fn(async () => result);
  chain.single = vi.fn(async () => result);
  chain.then = (
    resolve: (value: Result) => unknown,
    reject: (reason: unknown) => unknown,
  ) => Promise.resolve(result).then(resolve, reject);
  return chain;
}

function mockClient(responses: Record<string, Result[]>, calls: string[] = []) {
  const from = vi.fn((table: string) => {
    const result = responses[table]?.shift();
    if (!result) {
      throw new Error(`Missing mocked result for ${table}`);
    }
    calls.push(`from:${table}`);
    return queryChain(table, result, calls);
  });
  createSupabaseServerClient.mockReturnValue({ from });
  return { calls, from };
}

const success = (data: unknown, count?: number): Result => ({
  ...(count === undefined ? {} : { count }),
  data,
  error: null,
});
const reference = {
  deleted_at: null,
  id: ids.customer,
  is_active: true,
};
const mutation = success({ id: ids.booking });

describe("booking repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lists current bookings with exact pagination and stable ordering", async () => {
    const mock = mockClient({ bookings: [success([booking], 11)] });
    await expect(listBookings({ ...filters, page: 2 })).resolves.toMatchObject({
      data: [booking],
      pagination: { page: 2, pageCount: 2, total: 11 },
    });
    expect(createSupabaseServerClient).toHaveBeenCalledWith({
      serviceRole: true,
    });
    expect(mock.calls).toContain("bookings.range:[10,19]");
    expect(
      mock.calls.some((call) =>
        call.includes('bookings.is:["deleted_at",null]'),
      ),
    ).toBe(true);
  });

  it("searches related names and applies all filters", async () => {
    const mock = mockClient({
      bookings: [success([], 0)],
      customers: [success([{ id: ids.customer }])],
      services: [success([{ id: ids.service }])],
      staff: [success([{ id: ids.staff }])],
    });
    await listBookings({
      ...filters,
      customerId: ids.customer,
      dateFrom: "2026-08-01",
      dateTo: "2026-08-31",
      deleted: "deleted",
      direction: "desc",
      search: "A%_",
      serviceId: ids.service,
      staffId: ids.staff,
      status: "confirmed",
    });
    expect(mock.calls.some((call) => call.includes("customer_id.in."))).toBe(
      true,
    );
    expect(mock.calls.some((call) => call.includes("booking_date"))).toBe(true);
    expect(
      mock.calls.some((call) => call.includes('deleted_at","is",null')),
    ).toBe(true);
  });

  it("short-circuits searches with no matches", async () => {
    mockClient({
      customers: [success([])],
      services: [success([])],
      staff: [success([])],
    });
    await expect(
      listBookings({ ...filters, search: "nobody" }),
    ).resolves.toMatchObject({ data: [], pagination: { total: 0 } });
  });

  it("replaces list and search errors", async () => {
    mockClient({
      bookings: [{ data: null, error: { message: "detail" } }],
    });
    await expect(listBookings(filters)).rejects.toThrow(
      "Bookings could not be loaded.",
    );

    mockClient({
      customers: [{ data: null, error: { message: "detail" } }],
      services: [success([])],
      staff: [success([])],
    });
    await expect(listBookings({ ...filters, search: "alex" })).rejects.toThrow(
      "Bookings could not be loaded.",
    );
  });

  it("loads one booking or null safely", async () => {
    mockClient({ bookings: [success(booking)] });
    await expect(getBookingById(ids.booking)).resolves.toEqual(booking);
    mockClient({ bookings: [success(null)] });
    await expect(getBookingById(ids.booking)).resolves.toBeNull();
    mockClient({
      bookings: [{ data: null, error: { message: "detail" } }],
    });
    await expect(getBookingById(ids.booking)).rejects.toThrow(
      "Booking could not be loaded.",
    );
  });

  it("loads active selection options and preserves current identifiers", async () => {
    const mock = mockClient({
      customers: [
        success([{ ...reference, full_name: "Alex", id: ids.customer }]),
      ],
      services: [success([{ ...reference, id: ids.service, name: "Cut" }])],
      staff: [success([{ ...reference, display_name: "Sam", id: ids.staff }])],
    });
    await expect(
      listBookingSelectionOptions({
        customerId: ids.customer,
        serviceId: ids.service,
        staffId: ids.staff,
      }),
    ).resolves.toMatchObject({
      customers: [{ full_name: "Alex" }],
      services: [{ name: "Cut" }],
      staff: [{ display_name: "Sam" }],
    });
    expect(mock.calls.some((call) => call.includes(ids.customer))).toBe(true);
  });

  it("creates after validating references and the exact slot", async () => {
    const mock = mockClient({
      bookings: [success(null), mutation],
      customers: [success(reference)],
      services: [success({ ...reference, id: ids.service })],
      staff: [success({ ...reference, id: ids.staff })],
    });
    await expect(createBooking(values)).resolves.toBeUndefined();
    expect(mock.calls.some((call) => call.startsWith("bookings.insert"))).toBe(
      true,
    );
  });

  it("updates current bookings and permits unchanged historical references", async () => {
    const mock = mockClient({
      bookings: [success(booking), success(null), mutation],
      customers: [success({ ...reference, is_active: false })],
      services: [success({ ...reference, id: ids.service })],
      staff: [success({ ...reference, id: ids.staff })],
    });
    await expect(updateBooking(ids.booking, values)).resolves.toBeUndefined();
    expect(mock.calls.some((call) => call.startsWith("bookings.update"))).toBe(
      true,
    );
  });

  it("rejects inactive replacement references and occupied slots", async () => {
    mockClient({
      bookings: [],
      customers: [success({ ...reference, id: "other", is_active: false })],
      services: [success({ ...reference, id: ids.service })],
      staff: [success({ ...reference, id: ids.staff })],
    });
    await expect(createBooking(values)).rejects.toThrow("active, non-deleted");

    mockClient({
      bookings: [success({ id: "conflict" })],
      customers: [success(reference)],
      services: [success({ ...reference, id: ids.service })],
      staff: [success({ ...reference, id: ids.staff })],
    });
    await expect(createBooking(values)).rejects.toThrow("exact start time");
  });

  it("soft deletes and restores with state guards", async () => {
    const deletion = mockClient({ bookings: [mutation] });
    await softDeleteBooking(ids.booking);
    expect(deletion.calls.some((call) => call.includes("deleted_at"))).toBe(
      true,
    );

    mockClient({
      bookings: [
        success({ ...booking, deleted_at: "2026-07-30T01:00:00.000Z" }),
        success(null),
        mutation,
      ],
      customers: [success(reference)],
      services: [success({ ...reference, id: ids.service })],
      staff: [success({ ...reference, id: ids.staff })],
    });
    await expect(restoreBooking(ids.booking)).resolves.toBeUndefined();
  });

  it("rejects invalid booking states", async () => {
    mockClient({ bookings: [success({ ...booking, deleted_at: "deleted" })] });
    await expect(updateBooking(ids.booking, values)).rejects.toThrow(
      "current bookings",
    );
    mockClient({ bookings: [success(booking)] });
    await expect(restoreBooking(ids.booking)).rejects.toThrow(
      "deleted bookings",
    );
  });

  it("maps constraint and missing mutation failures safely", async () => {
    mockClient({
      bookings: [
        success(null),
        {
          data: null,
          error: {
            code: "23505",
            message: "bookings_current_staff_slot_unique_idx",
          },
        },
      ],
      customers: [success(reference)],
      services: [success({ ...reference, id: ids.service })],
      staff: [success({ ...reference, id: ids.staff })],
    });
    await expect(createBooking(values)).rejects.toThrow("exact start time");

    mockClient({
      bookings: [success(null), success(null)],
      customers: [success(reference)],
      services: [success({ ...reference, id: ids.service })],
      staff: [success({ ...reference, id: ids.staff })],
    });
    await expect(createBooking(values)).rejects.toThrow("could not be created");
  });
});
