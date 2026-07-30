import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";

import { APP_NAME } from "@/constants/app";
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
    <main className="bg-background text-foreground min-h-dvh">
      <div className="mx-auto grid min-h-dvh w-full max-w-7xl content-start gap-8 px-6 py-8 sm:px-10 lg:px-12">
        <header className="border-border flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-4">
            <span className="border-border bg-card grid size-11 place-items-center border">
              <CreditCard aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-muted-foreground text-sm">{APP_NAME}</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold">
                Payment management
              </h1>
            </div>
          </div>
          <UserButton />
        </header>
        <section className="grid gap-5">
          <div>
            <h2 className="font-serif text-3xl font-semibold">
              Payment history
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Start checkout from a booking or appointment. Financial history
              remains immutable.
            </p>
          </div>
          <PaymentManagementControls filters={filters} />
          <PaymentList result={result} searchParams={searchParams} />
        </section>
      </div>
    </main>
  );
}
