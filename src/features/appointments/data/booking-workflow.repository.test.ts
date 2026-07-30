import { beforeEach, describe, expect, it, vi } from "vitest";

const createSupabaseServerClient = vi.hoisted(() => vi.fn());
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient }));

import {
  getBookingWorkflowDetail,
  listBookingWorkflowQueue,
  transitionBookingStatus,
} from "@/features/appointments/data/booking-workflow.repository";

type Result = {
  readonly count?: number;
  readonly data: unknown;
  readonly error: { readonly message: string } | null;
};

function chain(result: Result, calls: string[]) {
  const query: Record<string, unknown> = {};
  for (const method of [
    "eq",
    "gte",
    "ilike",
    "is",
    "lte",
    "or",
    "order",
    "select",
  ]) {
    query[method] = vi.fn((...args: unknown[]) => {
      calls.push(`${method}:${JSON.stringify(args)}`);
      return query;
    });
  }
  query.update = vi.fn((value: unknown) => {
    calls.push(`update:${JSON.stringify(value)}`);
    return query;
  });
  query.range = vi.fn(async () => result);
  query.maybeSingle = vi.fn(async () => result);
  query.then = (resolve: (value: Result) => unknown) =>
    Promise.resolve(result).then(resolve);
  return query;
}

function useResults(results: Result[]) {
  const calls: string[] = [];
  createSupabaseServerClient.mockReturnValue({
    from: vi.fn(() => chain(results.shift()!, calls)),
  });
  return calls;
}

const booking = {
  booking_date: "2026-08-10",
  created_at: "2026-08-01T00:00:00Z",
  customer: null,
  customer_id: "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77",
  deleted_at: null,
  id: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
  service: null,
  service_id: "3bbc8fb4-f88b-491a-84f4-463b9cda4279",
  staff: null,
  staff_id: "c4651894-b328-4873-8ea9-66ca850bcf45",
  start_time: "09:30:00",
  status: "pending",
  updated_at: "2026-08-01T00:00:00Z",
} as const;

describe("booking workflow repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads one paginated booking query and derives transitions", async () => {
    const calls = useResults([{ count: 1, data: [booking], error: null }]);
    const result = await listBookingWorkflowQueue(
      {
        bookingDate: "2026-08-10",
        direction: "asc",
        page: 1,
        pageSize: 10,
        search: "",
        sort: "start_time",
        staffId: "",
        status: "all",
      },
      "2026-08-10",
    );
    expect(result.data[0]?.availableTransitions).toEqual([
      "confirmed",
      "cancelled",
      "no_show",
    ]);
    expect(calls).toContain('eq:["booking_date","2026-08-10"]');
  });

  it("loads a booking-based workflow detail", async () => {
    useResults([{ data: booking, error: null }]);
    await expect(
      getBookingWorkflowDetail(booking.id, "2026-08-10"),
    ).resolves.toMatchObject({ id: booking.id });
  });

  it("searches joined relationships without per-row reads", async () => {
    const calls = useResults([{ count: 0, data: [], error: null }]);
    await listBookingWorkflowQueue(
      {
        bookingDate: "2026-08-10",
        direction: "asc",
        page: 1,
        pageSize: 10,
        search: "Alex",
        sort: "start_time",
        staffId: "",
        status: "all",
      },
      "2026-08-10",
    );
    expect(calls).toContain('ilike:["customer_search.full_name","%Alex%"]');
    expect(calls).toContain(
      'or:["customer_search.not.is.null,staff_search.not.is.null,service_search.not.is.null"]',
    );
    expect(createSupabaseServerClient).toHaveBeenCalledOnce();
  });

  it("performs an atomic conditional transition", async () => {
    const calls = useResults([{ data: { id: booking.id }, error: null }]);
    await transitionBookingStatus(
      {
        booking_id: booking.id,
        expected_status: "pending",
        target_status: "confirmed",
      },
      "2026-08-10",
    );
    expect(calls).toContain('update:{"status":"confirmed"}');
    expect(calls).toContain(`eq:["id","${booking.id}"]`);
    expect(calls).toContain('eq:["status","pending"]');
    expect(calls).toContain('is:["deleted_at",null]');
    expect(calls).toContain('gte:["booking_date","2026-08-10"]');
  });

  it("rejects every forbidden transition before updating", async () => {
    const calls = useResults([]);
    await expect(
      transitionBookingStatus(
        {
          booking_id: booking.id,
          expected_status: "pending",
          target_status: "completed",
        },
        "2026-08-10",
      ),
    ).rejects.toThrow("not allowed");
    expect(calls).toEqual([]);
  });

  it("maps zero-row updates to the stable stale-state message", async () => {
    useResults([{ data: null, error: null }]);
    await expect(
      transitionBookingStatus(
        {
          booking_id: booking.id,
          expected_status: "confirmed",
          target_status: "no_show",
        },
        "2026-08-10",
      ),
    ).rejects.toThrow("changed or the transition is no longer available");
  });
});
