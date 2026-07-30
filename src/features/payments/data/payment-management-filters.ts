import { z } from "zod";

import {
  PAYMENT_ENTRY_TYPES,
  PAYMENT_METHODS,
  PAYMENT_PAGE_SIZE,
  PAYMENT_SORT_FIELDS,
} from "@/features/payments/constants/payment.constants";
import type {
  PaymentListFilters,
  PaymentSearchParams,
} from "@/features/payments/types/payment-management.types";

const dateSchema = z.iso.date();

function single(value: string | readonly string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function parsePaymentListFilters(
  params: PaymentSearchParams,
): PaymentListFilters {
  let dateFrom = dateSchema.safeParse(single(params.date_from));
  let dateTo = dateSchema.safeParse(single(params.date_to));
  if (dateFrom.success && dateTo.success && dateFrom.data > dateTo.data) {
    dateFrom = dateSchema.safeParse("");
    dateTo = dateSchema.safeParse("");
  }

  const page = Number.parseInt(single(params.page), 10);
  const entryType = single(params.entry_type);
  const method = single(params.method);
  const sort = single(params.sort);

  return {
    dateFrom: dateFrom.success ? dateFrom.data : "",
    dateTo: dateTo.success ? dateTo.data : "",
    direction: single(params.direction) === "asc" ? "asc" : "desc",
    entryType: PAYMENT_ENTRY_TYPES.includes(
      entryType as (typeof PAYMENT_ENTRY_TYPES)[number],
    )
      ? (entryType as PaymentListFilters["entryType"])
      : "all",
    method: PAYMENT_METHODS.includes(method as (typeof PAYMENT_METHODS)[number])
      ? (method as PaymentListFilters["method"])
      : "all",
    page: Number.isInteger(page) && page > 0 ? page : 1,
    pageSize: PAYMENT_PAGE_SIZE,
    search: single(params.search).trim().slice(0, 120),
    sort: PAYMENT_SORT_FIELDS.includes(
      sort as (typeof PAYMENT_SORT_FIELDS)[number],
    )
      ? (sort as PaymentListFilters["sort"])
      : "payment_date",
  };
}

export function parsePaymentHistoryPage(
  value: string | readonly string[] | undefined,
) {
  const page = Number.parseInt(single(value), 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
