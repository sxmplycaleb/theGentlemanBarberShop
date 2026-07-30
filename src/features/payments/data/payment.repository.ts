import "server-only";

import { PAYMENT_PAGE_SIZE } from "@/features/payments/constants/payment.constants";
import { calculateRefundableAmount } from "@/features/payments/data/payment-calculations";
import type {
  BookingPaymentTotals,
  CheckoutBooking,
  CheckoutDetail,
  PaginatedPayments,
  PaymentDetail,
  PaymentListFilters,
  PaymentRow,
  PaymentSupabaseClient,
} from "@/features/payments/types/payment-management.types";
import type {
  CompleteCheckoutValues,
  RecordPaymentValues,
  RecordRefundValues,
} from "@/features/payments/validation/payment.schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const paymentColumns =
  "amount_cents,booking_id,created_at,currency_code,entry_type,id,original_payment_id,payment_date,payment_method,receipt_booking_date,receipt_business_name,receipt_customer_name,receipt_service_name,receipt_staff_name,receipt_start_time,reference_number,refund_reason";
const checkoutColumns =
  "booking_date,charge_amount_cents,charge_currency_code,created_at,customer_id,deleted_at,id,service_id,staff_id,start_time,status,updated_at,customer:customers!bookings_customer_id_fkey(id,full_name,is_active,deleted_at),service:services!bookings_service_id_fkey(id,name,is_active,deleted_at),staff:staff!bookings_staff_id_fkey(id,display_name,is_active,deleted_at)";

const errorMessages: Readonly<Record<string, string>> = {
  payment_booking_cancelled: "Cancelled bookings cannot accept payments.",
  payment_booking_deleted: "Deleted bookings cannot accept payments.",
  payment_booking_zero_charge: "This booking has no charge to pay.",
  payment_currency_changed: "Payment currency changed. Refresh and try again.",
  payment_date_in_future: "Payment date cannot be in the future.",
  payment_exceeds_outstanding_balance:
    "Payment exceeds the outstanding balance. Refresh and try again.",
  refund_exceeds_refundable_amount:
    "Refund exceeds the refundable amount. Refresh and try again.",
  refund_original_payment_invalid:
    "The original payment is not available for this refund.",
};

function client() {
  return createSupabaseServerClient({
    serviceRole: true,
  }) as unknown as PaymentSupabaseClient;
}

function mapPayment(row: unknown) {
  return row as PaymentRow;
}

function paymentError(
  error: { readonly message: string } | null,
  fallback: string,
) {
  if (error) {
    for (const [databaseMessage, safeMessage] of Object.entries(
      errorMessages,
    )) {
      if (error.message.includes(databaseMessage))
        return new Error(safeMessage);
    }
  }
  return new Error(fallback);
}

function escapeSearch(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_")
    .replaceAll(",", "\\,")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function listPayments(
  filters: PaymentListFilters,
): Promise<PaginatedPayments> {
  const from = (filters.page - 1) * filters.pageSize;
  let query = client()
    .from("payments")
    .select(paymentColumns, { count: "exact" });

  if (filters.search) {
    const term = escapeSearch(filters.search);
    const pattern = `*${term}*`;
    const clauses = [
      `reference_number.ilike.${pattern}`,
      `receipt_customer_name.ilike.${pattern}`,
      `receipt_staff_name.ilike.${pattern}`,
      `receipt_service_name.ilike.${pattern}`,
    ];
    if (isUuid(filters.search)) {
      clauses.push(
        `id.eq.${filters.search}`,
        `booking_id.eq.${filters.search}`,
      );
    }
    query = query.or(clauses.join(","));
  }
  if (filters.entryType !== "all") {
    query = query.eq("entry_type", filters.entryType);
  }
  if (filters.method !== "all") {
    query = query.eq("payment_method", filters.method);
  }
  if (filters.dateFrom) {
    query = query.gte("payment_date", `${filters.dateFrom}T00:00:00.000Z`);
  }
  if (filters.dateTo) {
    query = query.lte("payment_date", `${filters.dateTo}T23:59:59.999Z`);
  }

  const { count, data, error } = await query
    .order(filters.sort, { ascending: filters.direction === "asc" })
    .order("id", { ascending: filters.direction === "asc" })
    .range(from, from + filters.pageSize - 1);

  if (error) throw new Error("Payments could not be loaded.");
  const total = count ?? 0;
  return {
    data: (data ?? []).map(mapPayment),
    pagination: {
      page: filters.page,
      pageCount: Math.max(1, Math.ceil(total / filters.pageSize)),
      pageSize: filters.pageSize,
      total,
    },
  };
}

export async function getBookingPaymentTotals(
  bookingId: string,
): Promise<BookingPaymentTotals | null> {
  const { data, error } = await client()
    .from("booking_payment_totals")
    .select(
      "booking_id,charge_amount_cents,currency_code,gross_paid_cents,net_paid_cents,outstanding_balance_cents,total_refunded_cents",
    )
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (error) throw new Error("Payment totals could not be loaded.");
  return data as BookingPaymentTotals | null;
}

export async function getCheckoutDetail(
  bookingId: string,
): Promise<CheckoutDetail | null> {
  const repositoryClient = client();
  const [bookingResult, totals] = await Promise.all([
    repositoryClient
      .from("bookings")
      .select(checkoutColumns)
      .eq("id", bookingId)
      .maybeSingle(),
    getBookingPaymentTotals(bookingId),
  ]);

  if (bookingResult.error) throw new Error("Checkout could not be loaded.");
  if (!bookingResult.data || !totals) return null;
  return {
    booking: bookingResult.data as unknown as CheckoutBooking,
    totals,
  };
}

export async function listBookingPaymentHistory(
  bookingId: string,
  page: number,
): Promise<PaginatedPayments> {
  const from = (page - 1) * PAYMENT_PAGE_SIZE;
  const { count, data, error } = await client()
    .from("payments")
    .select(paymentColumns, { count: "exact" })
    .eq("booking_id", bookingId)
    .order("payment_date", { ascending: false })
    .order("id", { ascending: false })
    .range(from, from + PAYMENT_PAGE_SIZE - 1);

  if (error) throw new Error("Payment history could not be loaded.");
  const total = count ?? 0;
  return {
    data: (data ?? []).map(mapPayment),
    pagination: {
      page,
      pageCount: Math.max(1, Math.ceil(total / PAYMENT_PAGE_SIZE)),
      pageSize: PAYMENT_PAGE_SIZE,
      total,
    },
  };
}

export async function getPaymentDetail(
  paymentId: string,
): Promise<PaymentDetail | null> {
  const repositoryClient = client();
  const { data, error } = await repositoryClient
    .from("payments")
    .select(paymentColumns)
    .eq("id", paymentId)
    .maybeSingle();

  if (error) throw new Error("Payment details could not be loaded.");
  if (!data) return null;
  const payment = mapPayment(data);
  const [totals, refundsResult] = await Promise.all([
    getBookingPaymentTotals(payment.booking_id),
    repositoryClient
      .from("payments")
      .select(paymentColumns, { count: "exact" })
      .eq("entry_type", "refund")
      .eq("original_payment_id", payment.id)
      .order("payment_date", { ascending: false })
      .limit(101),
  ]);

  if (!totals) throw new Error("Payment totals could not be loaded.");
  if (refundsResult.error)
    throw new Error("Refund history could not be loaded.");
  const refunds = (refundsResult.data ?? []).map(mapPayment);
  const refundedAmount =
    (refundsResult.count ?? refunds.length) > 100
      ? payment.amount_cents
      : refunds.reduce((total, refund) => total + refund.amount_cents, 0);

  return {
    payment,
    refundableAmountCents:
      payment.entry_type === "payment"
        ? calculateRefundableAmount(payment.amount_cents, refundedAmount)
        : 0,
    refunds: refunds.slice(0, 100),
    totals,
  };
}

export async function recordPayment(values: RecordPaymentValues) {
  const { data, error } = await client()
    .from("payments")
    .insert({
      amount_cents: values.amount,
      booking_id: values.booking_id,
      currency_code: values.currency_code,
      entry_type: "payment",
      payment_date: values.payment_date,
      payment_method: values.payment_method,
      reference_number: values.reference_number,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw paymentError(error, "Payment could not be recorded.");
  }
  return data.id;
}

export async function completeCheckout(values: CompleteCheckoutValues) {
  const totals = await getBookingPaymentTotals(values.booking_id);
  if (!totals) throw new Error("Checkout could not be loaded.");
  if (totals.outstanding_balance_cents <= 0) {
    throw new Error("This booking has no outstanding balance.");
  }

  return recordPayment({
    ...values,
    amount: totals.outstanding_balance_cents,
  });
}

export async function recordRefund(values: RecordRefundValues) {
  const { data, error } = await client()
    .from("payments")
    .insert({
      amount_cents: values.amount,
      booking_id: values.booking_id,
      currency_code: values.currency_code,
      entry_type: "refund",
      original_payment_id: values.original_payment_id,
      payment_date: values.payment_date,
      payment_method: values.payment_method,
      reference_number: values.reference_number,
      refund_reason: values.refund_reason,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw paymentError(error, "Refund could not be recorded.");
  }
  return data.id;
}

export async function bookingHasFinancialHistory(bookingId: string) {
  const { data, error } = await client()
    .from("payments")
    .select("id")
    .eq("booking_id", bookingId)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error("Payment history could not be checked.");
  return Boolean(data);
}
