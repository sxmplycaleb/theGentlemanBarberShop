import { beforeEach, describe, expect, it, vi } from "vitest";

const createSupabaseServerClient = vi.hoisted(() => vi.fn());
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient }));

import {
  bookingHasFinancialHistory,
  completeCheckout,
  getCheckoutDetail,
  getPaymentDetail,
  listBookingPaymentHistory,
  listPayments,
  recordPayment,
  recordRefund,
} from "@/features/payments/data/payment.repository";
import type { PaymentListFilters } from "@/features/payments/types/payment-management.types";

type Result = {
  readonly count?: number | null;
  readonly data: unknown;
  readonly error: { readonly message: string } | null;
};

function queryChain(table: string, result: Result, calls: string[]) {
  const query: Record<string, unknown> = {};
  for (const method of ["eq", "gte", "limit", "lte", "or", "order", "select"]) {
    query[method] = vi.fn((...args: unknown[]) => {
      calls.push(`${table}.${method}:${JSON.stringify(args)}`);
      return query;
    });
  }
  query.insert = vi.fn((...args: unknown[]) => {
    calls.push(`${table}.insert:${JSON.stringify(args)}`);
    return query;
  });
  query.range = vi.fn(async (...args: unknown[]) => {
    calls.push(`${table}.range:${JSON.stringify(args)}`);
    return result;
  });
  query.maybeSingle = vi.fn(async () => result);
  query.single = vi.fn(async () => result);
  query.then = (resolve: (value: Result) => unknown) =>
    Promise.resolve(result).then(resolve);
  return query;
}

function useResults(responses: Record<string, Result[]>) {
  const calls: string[] = [];
  createSupabaseServerClient.mockReturnValue({
    from: vi.fn((table: string) => {
      const result = responses[table]?.shift();
      if (!result) throw new Error(`Missing result for ${table}`);
      calls.push(`from:${table}`);
      return queryChain(table, result, calls);
    }),
  });
  return calls;
}

const bookingId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";
const paymentId = "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77";
const payment = {
  amount_cents: 10_000,
  booking_id: bookingId,
  created_at: "2026-07-30T09:30:00.000Z",
  currency_code: "KES",
  entry_type: "payment",
  id: paymentId,
  original_payment_id: null,
  payment_date: "2026-07-30T09:30:00.000Z",
  payment_method: "mpesa",
  receipt_booking_date: "2026-07-30",
  receipt_business_name: "The Gentleman",
  receipt_customer_name: "Alex",
  receipt_service_name: "Haircut",
  receipt_staff_name: "Sam",
  receipt_start_time: "09:00:00",
  reference_number: "REF-1",
  refund_reason: null,
} as const;
const totals = {
  booking_id: bookingId,
  charge_amount_cents: 20_000,
  currency_code: "KES",
  gross_paid_cents: 10_000,
  net_paid_cents: 8_000,
  outstanding_balance_cents: 12_000,
  total_refunded_cents: 2_000,
};
const filters: PaymentListFilters = {
  dateFrom: "",
  dateTo: "",
  direction: "desc",
  entryType: "all",
  method: "all",
  page: 1,
  pageSize: 10,
  search: "",
  sort: "payment_date",
};
const formValues = {
  amount: 5_000,
  booking_id: bookingId,
  currency_code: "KES" as const,
  payment_date: "2026-07-30T09:30:00.000Z",
  payment_method: "mpesa" as const,
  reference_number: "REF-1",
};

describe("payment repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lists searched, filtered, sorted, and paginated ledger entries", async () => {
    const calls = useResults({
      payments: [{ count: 11, data: [payment], error: null }],
    });
    await expect(
      listPayments({
        ...filters,
        dateFrom: "2026-07-01",
        dateTo: "2026-07-31",
        entryType: "payment",
        method: "mpesa",
        page: 2,
        search: bookingId,
      }),
    ).resolves.toMatchObject({
      data: [payment],
      pagination: { page: 2, pageCount: 2, total: 11 },
    });
    expect(calls.some((call) => call.includes("booking_id.eq"))).toBe(true);
    expect(calls).toContain("payments.range:[10,19]");
  });

  it("loads checkout and bounded booking history without per-row reads", async () => {
    const booking = {
      booking_date: "2026-07-30",
      charge_amount_cents: 20_000,
      charge_currency_code: "KES",
      id: bookingId,
      status: "confirmed",
    };
    useResults({
      booking_payment_totals: [{ data: totals, error: null }],
      bookings: [{ data: booking, error: null }],
    });
    await expect(getCheckoutDetail(bookingId)).resolves.toMatchObject({
      booking,
      totals,
    });

    const calls = useResults({
      payments: [{ count: 1, data: [payment], error: null }],
    });
    await expect(
      listBookingPaymentHistory(bookingId, 1),
    ).resolves.toMatchObject({
      pagination: { total: 1 },
    });
    expect(calls).toContain("payments.range:[0,9]");
  });

  it("loads receipt detail, totals, refunds, and refundable amount", async () => {
    const refund = {
      ...payment,
      amount_cents: 2_000,
      entry_type: "refund",
      id: "3bbc8fb4-f88b-491a-84f4-463b9cda4279",
      original_payment_id: paymentId,
      refund_reason: "Customer request",
    };
    useResults({
      booking_payment_totals: [{ data: totals, error: null }],
      payments: [
        { data: payment, error: null },
        { count: 1, data: [refund], error: null },
      ],
    });
    await expect(getPaymentDetail(paymentId)).resolves.toMatchObject({
      payment,
      refundableAmountCents: 8_000,
      refunds: [refund],
    });
  });

  it("records partial payments, full checkout, refunds, and checks history", async () => {
    let calls = useResults({
      payments: [{ data: { id: paymentId }, error: null }],
    });
    await expect(recordPayment(formValues)).resolves.toBe(paymentId);
    expect(calls.some((call) => call.includes('"amount_cents":5000'))).toBe(
      true,
    );

    calls = useResults({
      booking_payment_totals: [{ data: totals, error: null }],
      payments: [{ data: { id: paymentId }, error: null }],
    });
    await expect(
      completeCheckout({
        booking_id: bookingId,
        currency_code: "KES",
        payment_date: formValues.payment_date,
        payment_method: "mpesa",
        reference_number: "REF-1",
      }),
    ).resolves.toBe(paymentId);
    expect(calls.some((call) => call.includes('"amount_cents":12000'))).toBe(
      true,
    );

    useResults({
      payments: [{ data: { id: "refund-id" }, error: null }],
    });
    await expect(
      recordRefund({
        ...formValues,
        original_payment_id: paymentId,
        refund_reason: "Customer request",
      }),
    ).resolves.toBe("refund-id");

    useResults({ payments: [{ data: { id: paymentId }, error: null }] });
    await expect(bookingHasFinancialHistory(bookingId)).resolves.toBe(true);
  });

  it("maps database validation failures to stable messages", async () => {
    useResults({
      payments: [
        {
          data: null,
          error: { message: "payment_exceeds_outstanding_balance" },
        },
      ],
    });
    await expect(recordPayment(formValues)).rejects.toThrow(
      "exceeds the outstanding balance",
    );

    useResults({
      booking_payment_totals: [
        {
          data: { ...totals, outstanding_balance_cents: 0 },
          error: null,
        },
      ],
    });
    await expect(
      completeCheckout({
        booking_id: bookingId,
        currency_code: "KES",
        payment_date: formValues.payment_date,
        payment_method: "cash",
        reference_number: null,
      }),
    ).rejects.toThrow("no outstanding balance");
  });
});
