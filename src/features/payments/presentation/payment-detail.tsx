import Link from "next/link";

import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/page-header";
import { formatCurrency } from "@/features/payments/data/payment-calculations";
import { PaymentReceipt } from "@/features/payments/presentation/payment-receipt";
import { RefundForm } from "@/features/payments/presentation/refund-form";
import type {
  PaymentAction,
  PaymentDetail as PaymentDetailType,
} from "@/features/payments/types/payment-management.types";

export function PaymentDetail({
  defaultPaymentDate,
  detail,
  refundAction,
}: {
  readonly defaultPaymentDate: string;
  readonly detail: PaymentDetailType;
  readonly refundAction: PaymentAction;
}) {
  const { payment, refundableAmountCents, refunds, totals } = detail;

  return (
    <AuthenticatedPageShell
      description="Review the immutable receipt and available refund actions."
      title="Payment details"
    >
      <div className="grid max-w-5xl gap-8">
        <PaymentReceipt payment={payment} totals={totals} />

        {payment.entry_type === "refund" && payment.original_payment_id ? (
          <Button asChild className="w-fit" variant="outline">
            <Link href={`/account/payments/${payment.original_payment_id}`}>
              View original payment
            </Link>
          </Button>
        ) : null}

        {payment.entry_type === "payment" && refundableAmountCents > 0 ? (
          <RefundForm
            action={refundAction}
            bookingId={payment.booking_id}
            currencyCode={payment.currency_code}
            defaultPaymentDate={defaultPaymentDate}
            originalPaymentId={payment.id}
            refundableAmountCents={refundableAmountCents}
          />
        ) : payment.entry_type === "payment" ? (
          <Alert role="status" variant="info">
            This payment is fully refunded.
          </Alert>
        ) : null}

        {refunds.length ? (
          <section className="grid gap-3">
            <SectionHeader title="Recorded refunds" />
            <ul className="grid gap-2">
              {refunds.map((refund) => (
                <li key={refund.id}>
                  <Card className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
                    <span>
                      {refund.payment_date.slice(0, 10)} &middot;{" "}
                      {formatCurrency(
                        refund.amount_cents,
                        refund.currency_code,
                      )}
                    </span>
                    <Link
                      className="text-primary font-semibold underline-offset-4 hover:underline"
                      href={`/account/payments/${refund.id}`}
                    >
                      Refund receipt
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/account/payments">Back to payments</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/account/payments/checkout/${payment.booking_id}`}>
              Booking checkout
            </Link>
          </Button>
        </div>
      </div>
    </AuthenticatedPageShell>
  );
}
