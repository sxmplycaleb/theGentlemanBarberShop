import Link from "next/link";

import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/page-header";
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
      <dd className="mt-1 font-semibold">{value}</dd>
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
    <AuthenticatedPageShell
      description={`Review and settle booking ${booking.id}.`}
      title="Checkout"
    >
      <div className="grid max-w-6xl gap-8">
        <Card>
          <CardContent>
            <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
            </dl>
          </CardContent>
        </Card>

        {canAcceptPayment ? (
          <PaymentForm
            bookingId={booking.id}
            completeAction={completeAction}
            currencyCode={totals.currency_code}
            defaultPaymentDate={defaultPaymentDate}
            recordAction={recordAction}
          />
        ) : (
          <Alert
            role="status"
            title={
              totals.outstanding_balance_cents === 0
                ? "Financially settled"
                : "Payments unavailable"
            }
            variant={
              totals.outstanding_balance_cents === 0 ? "success" : "warning"
            }
          >
            {booking.deleted_at
              ? "Deleted bookings cannot accept new payments."
              : booking.status === "cancelled"
                ? "Cancelled bookings cannot accept new payments. Existing payments can be refunded from their receipt."
                : "This booking has no outstanding balance."}
          </Alert>
        )}

        <section className="grid gap-4">
          <SectionHeader
            description="Payment and refund entries are immutable."
            title="Booking payment history"
          />
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
            <Link href={`/account/appointments/${booking.id}`}>
              Appointment
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/account/bookings/${booking.id}/edit`}>Booking</Link>
          </Button>
        </div>
      </div>
    </AuthenticatedPageShell>
  );
}
