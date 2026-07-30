import Link from "next/link";

import { Pagination } from "@/components/management/pagination";
import { Button } from "@/components/ui/button";
import {
  PAYMENT_ENTRY_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/features/payments/constants/payment.constants";
import { formatCurrency } from "@/features/payments/data/payment-calculations";
import type {
  PaginatedPayments,
  PaymentHistorySearchParams,
  PaymentSearchParams,
} from "@/features/payments/types/payment-management.types";

function paramsFrom(input: PaymentSearchParams & PaymentHistorySearchParams) {
  const params = new URLSearchParams();
  Object.entries(input).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (typeof value === "string" && value) params.set(key, value);
  });
  return params;
}

export function PaymentList({
  pageParam = "page",
  result,
  searchParams = {},
}: {
  readonly pageParam?: string;
  readonly result: PaginatedPayments;
  readonly searchParams?: PaymentSearchParams & PaymentHistorySearchParams;
}) {
  return (
    <div className="grid gap-4">
      <div className="border-border overflow-x-auto border">
        <table className="w-full min-w-[70rem] text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Payment date</th>
              <th className="px-4 py-3">Entry</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {result.data.length ? (
              result.data.map((payment) => (
                <tr className="border-border border-t" key={payment.id}>
                  <td className="px-4 py-4">
                    {payment.payment_date.slice(0, 16).replace("T", " ")} UTC
                  </td>
                  <td className="px-4 py-4">
                    <span className="border-border inline-flex min-h-7 items-center rounded-sm border px-2 text-xs">
                      {PAYMENT_ENTRY_LABELS[payment.entry_type]}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium">
                    {payment.receipt_customer_name}
                  </td>
                  <td className="px-4 py-4">{payment.receipt_service_name}</td>
                  <td className="px-4 py-4">
                    {PAYMENT_METHOD_LABELS[payment.payment_method]}
                  </td>
                  <td className="px-4 py-4">
                    {payment.reference_number ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-right font-medium">
                    {payment.entry_type === "refund" ? "−" : ""}
                    {formatCurrency(
                      payment.amount_cents,
                      payment.currency_code,
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button asChild variant="outline">
                      <Link href={`/account/payments/${payment.id}`}>
                        Details
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="text-muted-foreground px-4 py-8 text-center"
                  colSpan={8}
                >
                  No payments match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        pageParam={pageParam}
        pagination={result.pagination}
        searchParams={paramsFrom(searchParams)}
      />
    </div>
  );
}
