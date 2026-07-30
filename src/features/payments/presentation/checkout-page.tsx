import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/payments/data/payment-calculations";
import { PaymentForm } from "@/features/payments/presentation/payment-form";
import { PaymentList } from "@/features/payments/presentation/payment-list";
import type {
  CheckoutDetail,
  PaginatedPayments,
  PaymentAction,
} from "@/features/payments/types/payment-management.types";

function SummaryItem({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div>
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

export function CheckoutPage({
  completeAction,
  defaultPaymentDate,
  detail,
  history,
  historyPage,
  recordAction,
}: {
  readonly completeAction: PaymentAction;
  readonly defaultPaymentDate: string;
  readonly detail: CheckoutDetail;
  readonly history: PaginatedPayments;
  readonly historyPage: number;
  readonly recordAction: PaymentAction;
}) {
  const { booking, totals } = detail;
  const canAcceptPayment =
    !booking.deleted_at &&
    booking.status !== "cancelled" &&
    totals.outstanding_balance_cents > 0;
  const money = (amount: number) =>
    formatCurrency(amount, totals.currency_code);

  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-5xl content-start gap-8 px-6 py-8 sm:px-10">
      <header>
        <p className="text-muted-foreground text-sm">Payment management</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold">Checkout</h1>
        <p className="text-muted-foreground mt-2 text-sm break-all">
          Booking {booking.id}
        </p>
      </header>

      <section className="border-border grid gap-5 border p-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryItem
          label="Customer"
          value={booking.customer?.full_name ?? "Unknown"}
        />
        <SummaryItem
          label="Service"
          value={booking.service?.name ?? "Unknown"}
        />
        <SummaryItem
          label="Staff"
          value={booking.staff?.display_name ?? "Unknown"}
        />
        <SummaryItem
          label="Appointment"
          value={`${booking.booking_date} ${booking.start_time.slice(0, 5)}`}
        />
        <SummaryItem
          label="Agreed charge"
          value={money(totals.charge_amount_cents)}
        />
        <SummaryItem
          label="Gross paid"
          value={money(totals.gross_paid_cents)}
        />
        <SummaryItem
          label="Refunded"
          value={money(totals.total_refunded_cents)}
        />
        <SummaryItem
          label="Outstanding"
          value={money(totals.outstanding_balance_cents)}
        />
      </section>

      {canAcceptPayment ? (
        <PaymentForm
          bookingId={booking.id}
          completeAction={completeAction}
          currencyCode={totals.currency_code}
          defaultPaymentDate={defaultPaymentDate}
          recordAction={recordAction}
        />
      ) : (
        <section className="border-border bg-muted border p-6" role="status">
          <h2 className="text-xl font-semibold">
            {totals.outstanding_balance_cents === 0
              ? "Financially settled"
              : "Payments unavailable"}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {booking.deleted_at
              ? "Deleted bookings cannot accept new payments."
              : booking.status === "cancelled"
                ? "Cancelled bookings cannot accept new payments. Existing payments can be refunded from their receipt."
                : "This booking has no outstanding balance."}
          </p>
        </section>
      )}

      <section className="grid gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Booking payment history</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Payment and refund entries are immutable.
          </p>
        </div>
        <PaymentList
          pageParam="history_page"
          result={history}
          searchParams={{ history_page: String(historyPage) }}
        />
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/account/payments">Payment history</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/account/appointments/${booking.id}`}>Appointment</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/account/bookings/${booking.id}/edit`}>Booking</Link>
        </Button>
      </div>
    </main>
  );
}
