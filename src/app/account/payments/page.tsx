import { auth } from "@clerk/nextjs/server";

import { parsePaymentListFilters } from "@/features/payments/data/payment-management-filters";
import { listPayments } from "@/features/payments/data/payment.repository";
import { PaymentManagementPage } from "@/features/payments/presentation/payment-management-page";
import type { PaymentSearchParams } from "@/features/payments/types/payment-management.types";

export default async function Page({
  searchParams,
}: {
  readonly searchParams: Promise<PaymentSearchParams>;
}) {
  await auth.protect();
  const params = await searchParams;
  const filters = parsePaymentListFilters(params);
  const result = await listPayments(filters);
  return (
    <PaymentManagementPage
      filters={filters}
      result={result}
      searchParams={params}
    />
  );
}
