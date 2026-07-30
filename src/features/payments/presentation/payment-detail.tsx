import Link from "next/link";

import { Button } from "@/components/ui/button";
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
    <main className="mx-auto grid min-h-dvh w-full max-w-5xl content-start gap-8 px-6 py-8 sm:px-10">
      <header>
        <p className="text-muted-foreground text-sm">Payment management</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold">
          Payment details
        </h1>
      </header>
      <PaymentReceipt payment={payment} totals={totals} />

      {payment.entry_type === "refund" && payment.original_payment_id ? (
        <Button asChild variant="outline">
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
        <p className="border-border bg-muted border p-6 text-sm" role="status">
          This payment is fully refunded.
        </p>
      ) : null}

      {refunds.length ? (
        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">Recorded refunds</h2>
          <ul className="grid gap-2">
            {refunds.map((refund) => (
              <li
                className="border-border flex flex-wrap items-center justify-between gap-3 border p-4 text-sm"
                key={refund.id}
              >
                <span>
                  {refund.payment_date.slice(0, 10)} ·{" "}
                  {formatCurrency(refund.amount_cents, refund.currency_code)}
                </span>
                <Link
                  className="underline underline-offset-4"
                  href={`/account/payments/${refund.id}`}
                >
                  Refund receipt
                </Link>
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
    </main>
  );
}
