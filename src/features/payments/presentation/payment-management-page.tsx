import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { SectionHeader } from "@/components/ui/page-header";
import { PaymentList } from "@/features/payments/presentation/payment-list";
import { PaymentManagementControls } from "@/features/payments/presentation/payment-management-controls";
import type {
  PaginatedPayments,
  PaymentListFilters,
  PaymentSearchParams,
} from "@/features/payments/types/payment-management.types";

export function PaymentManagementPage({
  filters,
  result,
  searchParams,
}: {
  readonly filters: PaymentListFilters;
  readonly result: PaginatedPayments;
  readonly searchParams: PaymentSearchParams;
}) {
  return (
    <AuthenticatedPageShell
      description="Review immutable payment history, receipts, and administrative refunds."
      title="Payment management"
    >
      <section className="grid gap-5">
        <SectionHeader
          description="Start checkout from a booking or appointment. Financial history remains immutable."
          title="Payment history"
        />
        <PaymentManagementControls filters={filters} />
        <PaymentList result={result} searchParams={searchParams} />
      </section>
    </AuthenticatedPageShell>
  );
}
