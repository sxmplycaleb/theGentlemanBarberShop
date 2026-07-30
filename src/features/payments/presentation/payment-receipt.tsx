import {
  PAYMENT_ENTRY_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/features/payments/constants/payment.constants";
import { formatCurrency } from "@/features/payments/data/payment-calculations";
import type {
  BookingPaymentTotals,
  PaymentRow,
} from "@/features/payments/types/payment-management.types";

function ReceiptItem({
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

export function PaymentReceipt({
  payment,
  totals,
}: {
  readonly payment: PaymentRow;
  readonly totals: BookingPaymentTotals;
}) {
  return (
    <article
      className="border-border grid gap-6 border p-6"
      aria-label="Receipt"
    >
      <header className="border-border border-b pb-5">
        <p className="text-muted-foreground text-sm">
          {payment.receipt_business_name}
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">
          {PAYMENT_ENTRY_LABELS[payment.entry_type]} receipt
        </h2>
        <p className="text-muted-foreground mt-2 text-xs break-all">
          Receipt {payment.id}
        </p>
      </header>
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ReceiptItem label="Customer" value={payment.receipt_customer_name} />
        <ReceiptItem label="Service" value={payment.receipt_service_name} />
        <ReceiptItem label="Staff" value={payment.receipt_staff_name} />
        <ReceiptItem
          label="Appointment"
          value={`${payment.receipt_booking_date} ${payment.receipt_start_time.slice(0, 5)}`}
        />
        <ReceiptItem
          label="Payment date"
          value={`${payment.payment_date.slice(0, 16).replace("T", " ")} UTC`}
        />
        <ReceiptItem
          label="Recorded"
          value={`${payment.created_at.slice(0, 16).replace("T", " ")} UTC`}
        />
        <ReceiptItem
          label="Method"
          value={PAYMENT_METHOD_LABELS[payment.payment_method]}
        />
        <ReceiptItem
          label="Reference"
          value={payment.reference_number ?? "Not supplied"}
        />
        <ReceiptItem
          label="Amount"
          value={`${payment.entry_type === "refund" ? "−" : ""}${formatCurrency(payment.amount_cents, payment.currency_code)}`}
        />
        {payment.refund_reason ? (
          <ReceiptItem label="Refund reason" value={payment.refund_reason} />
        ) : null}
      </dl>
      <section className="bg-muted grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReceiptItem
          label="Agreed charge"
          value={formatCurrency(
            totals.charge_amount_cents,
            totals.currency_code,
          )}
        />
        <ReceiptItem
          label="Gross paid"
          value={formatCurrency(totals.gross_paid_cents, totals.currency_code)}
        />
        <ReceiptItem
          label="Total refunded"
          value={formatCurrency(
            totals.total_refunded_cents,
            totals.currency_code,
          )}
        />
        <ReceiptItem
          label="Current outstanding"
          value={formatCurrency(
            totals.outstanding_balance_cents,
            totals.currency_code,
          )}
        />
      </section>
    </article>
  );
}
