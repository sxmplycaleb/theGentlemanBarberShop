export function calculateNetPaid(
  grossPaidCents: number,
  totalRefundedCents: number,
) {
  return grossPaidCents - totalRefundedCents;
}

export function calculateOutstandingBalance(
  chargeAmountCents: number,
  netPaidCents: number,
) {
  return Math.max(chargeAmountCents - netPaidCents, 0);
}

export function calculateRefundableAmount(
  originalAmountCents: number,
  refundedAmountCents: number,
) {
  return Math.max(originalAmountCents - refundedAmountCents, 0);
}

export function formatCurrency(amountCents: number, currencyCode: string) {
  return new Intl.NumberFormat("en-KE", {
    currency: currencyCode,
    style: "currency",
  }).format(amountCents / 100);
}
