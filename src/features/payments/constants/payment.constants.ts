import type {
  PaymentEntryType,
  PaymentMethod,
  PaymentSortField,
} from "@/features/payments/types/payment-management.types";

export const PAYMENT_METHODS = [
  "cash",
  "mpesa",
  "card",
  "bank_transfer",
] as const satisfies readonly PaymentMethod[];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: "Bank Transfer",
  card: "Card",
  cash: "Cash",
  mpesa: "M-Pesa",
};

export const PAYMENT_ENTRY_TYPES = [
  "payment",
  "refund",
] as const satisfies readonly PaymentEntryType[];

export const PAYMENT_ENTRY_LABELS: Record<PaymentEntryType, string> = {
  payment: "Payment",
  refund: "Refund",
};

export const PAYMENT_SORT_FIELDS = [
  "payment_date",
  "created_at",
  "amount_cents",
  "entry_type",
  "payment_method",
] as const satisfies readonly PaymentSortField[];

export const PAYMENT_PAGE_SIZE = 10;
export const PAYMENT_REFERENCE_MAX_LENGTH = 120;
export const REFUND_REASON_MAX_LENGTH = 500;

export const PAYMENT_SAFE_ERRORS = new Set([
  "Cancelled bookings cannot accept payments.",
  "Deleted bookings cannot accept payments.",
  "Payment currency changed. Refresh and try again.",
  "Payment date cannot be in the future.",
  "Payment exceeds the outstanding balance. Refresh and try again.",
  "Refund exceeds the refundable amount. Refresh and try again.",
  "The original payment is not available for this refund.",
  "This booking has no charge to pay.",
]);
