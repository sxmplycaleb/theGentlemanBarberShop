"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SubmitButton } from "@/components/management/submit-button";
import { formatCurrency } from "@/features/payments/data/payment-calculations";
import type {
  PaymentAction,
  PaymentActionState,
} from "@/features/payments/types/payment-management.types";

const initialState: PaymentActionState = { success: false };

export function RefundForm({
  action,
  bookingId,
  currencyCode,
  defaultPaymentDate,
  originalPaymentId,
  refundableAmountCents,
}: {
  readonly action: PaymentAction;
  readonly bookingId: string;
  readonly currencyCode: string;
  readonly defaultPaymentDate: string;
  readonly originalPaymentId: string;
  readonly refundableAmountCents: number;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const inputClass =
    "border-border bg-background min-h-11 rounded-sm border px-3 text-sm";

  return (
    <form
      action={formAction}
      className="border-border bg-card grid gap-4 rounded-lg border p-6 shadow-sm"
    >
      <input name="booking_id" type="hidden" value={bookingId} />
      <input name="currency_code" type="hidden" value={currencyCode} />
      <input
        name="original_payment_id"
        type="hidden"
        value={originalPaymentId}
      />
      <div>
        <h2 className="text-xl font-semibold">Record refund</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Refundable: {formatCurrency(refundableAmountCents, currencyCode)}.
          Recording a refund does not change booking status.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Amount ({currencyCode})</span>
          <input
            className={inputClass}
            inputMode="decimal"
            name="amount"
            placeholder="0.00"
            type="text"
          />
          {state.errors?.amount?.map((error) => (
            <span className="text-destructive" key={error}>
              {error}
            </span>
          ))}
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Refund method</span>
          <select className={inputClass} name="payment_method">
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">
            Refund date and time (UTC)
          </span>
          <input
            className={inputClass}
            defaultValue={defaultPaymentDate}
            name="payment_date"
            type="datetime-local"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Reference (optional)</span>
          <input
            className={inputClass}
            maxLength={120}
            name="reference_number"
            type="text"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Administrative reason</span>
        <textarea
          className="border-border bg-background min-h-28 rounded-sm border p-3 text-sm"
          maxLength={500}
          name="refund_reason"
        />
        {state.errors?.refund_reason?.map((error) => (
          <span className="text-destructive" key={error}>
            {error}
          </span>
        ))}
      </label>
      {state.message ? (
        <div
          aria-live={state.success ? "polite" : undefined}
          className="grid gap-2 text-sm"
          role={state.success ? "status" : "alert"}
        >
          <p>{state.message}</p>
          {state.success && state.paymentId ? (
            <Link
              className="underline underline-offset-4"
              href={`/account/payments/${state.paymentId}`}
            >
              View refund receipt
            </Link>
          ) : null}
        </div>
      ) : null}
      <SubmitButton>Record refund</SubmitButton>
    </form>
  );
}
