import {
  PAYMENT_ENTRY_LABELS,
  PAYMENT_ENTRY_TYPES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
} from "@/features/payments/constants/payment.constants";
import type { PaymentListFilters } from "@/features/payments/types/payment-management.types";

export function PaymentManagementControls({
  filters,
}: {
  readonly filters: PaymentListFilters;
}) {
  const inputClass =
    "border-border bg-background min-h-11 rounded-sm border px-3 text-sm";
  return (
    <form className="border-border bg-card grid gap-4 rounded-lg border p-4 shadow-sm md:grid-cols-2 xl:grid-cols-7">
      <input name="page" type="hidden" value="1" />
      <label className="grid gap-2 text-sm xl:col-span-2">
        <span className="text-muted-foreground">Payment search</span>
        <input
          className={inputClass}
          defaultValue={filters.search}
          name="search"
          placeholder="Receipt, booking, reference, or name"
          type="search"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Entry</span>
        <select
          className={inputClass}
          defaultValue={filters.entryType}
          name="entry_type"
        >
          <option value="all">All entries</option>
          {PAYMENT_ENTRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {PAYMENT_ENTRY_LABELS[type]}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Method</span>
        <select
          className={inputClass}
          defaultValue={filters.method}
          name="method"
        >
          <option value="all">All methods</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {PAYMENT_METHOD_LABELS[method]}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">From</span>
        <input
          className={inputClass}
          defaultValue={filters.dateFrom}
          name="date_from"
          type="date"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">To</span>
        <input
          className={inputClass}
          defaultValue={filters.dateTo}
          name="date_to"
          type="date"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Sort</span>
        <select className={inputClass} defaultValue={filters.sort} name="sort">
          <option value="payment_date">Payment date</option>
          <option value="created_at">Recorded date</option>
          <option value="amount_cents">Amount</option>
          <option value="entry_type">Entry type</option>
          <option value="payment_method">Method</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm xl:col-start-6">
        <span className="text-muted-foreground">Direction</span>
        <select
          className={inputClass}
          defaultValue={filters.direction}
          name="direction"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </label>
      <button
        className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-11 rounded-sm px-4 text-sm font-semibold shadow-xs xl:self-end"
        type="submit"
      >
        Apply
      </button>
    </form>
  );
}
