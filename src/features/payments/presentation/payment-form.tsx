"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SubmitButton } from "@/components/management/submit-button";
import type {
  PaymentAction,
  PaymentActionState,
} from "@/features/payments/types/payment-management.types";

const initialState: PaymentActionState = { success: false };

function Feedback({ state }: { readonly state: PaymentActionState }) {
  if (!state.message) return null;
  return (
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
          View receipt
        </Link>
      ) : null}
    </div>
  );
}

function Fields({
  bookingId,
  currencyCode,
  defaultPaymentDate,
  errors,
}: {
  readonly bookingId: string;
  readonly currencyCode: string;
  readonly defaultPaymentDate: string;
  readonly errors?: Record<string, readonly string[]> | undefined;
}) {
  const inputClass =
    "border-border bg-background min-h-11 rounded-sm border px-3 text-sm";
  return (
    <>
      <input name="booking_id" type="hidden" value={bookingId} />
      <input name="currency_code" type="hidden" value={currencyCode} />
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Payment method</span>
        <select className={inputClass} name="payment_method">
          <option value="cash">Cash</option>
          <option value="mpesa">M-Pesa</option>
          <option value="card">Card</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">
          Payment date and time (UTC)
        </span>
        <input
          className={inputClass}
          defaultValue={defaultPaymentDate}
          name="payment_date"
          type="datetime-local"
        />
        {errors?.payment_date?.map((error) => (
          <span className="text-destructive" key={error}>
            {error}
          </span>
        ))}
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Reference (optional)</span>
        <input
          className={inputClass}
          maxLength={120}
          name="reference_number"
          type="text"
        />
        {errors?.reference_number?.map((error) => (
          <span className="text-destructive" key={error}>
            {error}
          </span>
        ))}
      </label>
    </>
  );
}

export function PaymentForm({
  bookingId,
  completeAction,
  currencyCode,
  defaultPaymentDate,
  recordAction,
}: {
  readonly bookingId: string;
  readonly completeAction: PaymentAction;
  readonly currencyCode: string;
  readonly defaultPaymentDate: string;
  readonly recordAction: PaymentAction;
}) {
  const [partialState, partialFormAction] = useActionState(
    recordAction,
    initialState,
  );
  const [completeState, completeFormAction] = useActionState(
    completeAction,
    initialState,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        action={partialFormAction}
        className="border-border grid content-start gap-4 border p-6"
      >
        <div>
          <h2 className="text-xl font-semibold">Record partial payment</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Amounts are checked against the current server balance.
          </p>
        </div>
        <label className="grid gap-2 text-sm">
          <span className="text-muted-foreground">Amount ({currencyCode})</span>
          <input
            className="border-border bg-background min-h-11 rounded-sm border px-3 text-sm"
            inputMode="decimal"
            name="amount"
            placeholder="0.00"
            type="text"
          />
          {partialState.errors?.amount?.map((error) => (
            <span className="text-destructive" key={error}>
              {error}
            </span>
          ))}
        </label>
        <Fields
          bookingId={bookingId}
          currencyCode={currencyCode}
          defaultPaymentDate={defaultPaymentDate}
          errors={partialState.errors}
        />
        <Feedback state={partialState} />
        <SubmitButton>Record payment</SubmitButton>
      </form>

      <form
        action={completeFormAction}
        className="border-border grid content-start gap-4 border p-6"
      >
        <div>
          <h2 className="text-xl font-semibold">Full checkout</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            The server records exactly the remaining balance. Booking status is
            unchanged.
          </p>
        </div>
        <Fields
          bookingId={bookingId}
          currencyCode={currencyCode}
          defaultPaymentDate={defaultPaymentDate}
          errors={completeState.errors}
        />
        <Feedback state={completeState} />
        <SubmitButton>Complete checkout</SubmitButton>
      </form>
    </div>
  );
}
