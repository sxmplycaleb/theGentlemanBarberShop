import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import {
  completeCheckoutAction,
  recordPaymentAction,
} from "@/features/payments/actions/payment.actions";
import { parsePaymentHistoryPage } from "@/features/payments/data/payment-management-filters";
import {
  getCheckoutDetail,
  listBookingPaymentHistory,
} from "@/features/payments/data/payment.repository";
import { CheckoutPage } from "@/features/payments/presentation/checkout-page";
import type { PaymentHistorySearchParams } from "@/features/payments/types/payment-management.types";
import { bookingPaymentIdSchema } from "@/features/payments/validation/payment.schema";

export default async function Page({
  params,
  searchParams,
}: {
  readonly params: Promise<{ readonly bookingId: string }>;
  readonly searchParams: Promise<PaymentHistorySearchParams>;
}) {
  await auth.protect();
  const [{ bookingId }, query] = await Promise.all([params, searchParams]);
  const parsed = bookingPaymentIdSchema.safeParse({ booking_id: bookingId });
  if (!parsed.success) notFound();
  const historyPage = parsePaymentHistoryPage(query.history_page);
  const [detail, history] = await Promise.all([
    getCheckoutDetail(parsed.data.booking_id),
    listBookingPaymentHistory(parsed.data.booking_id, historyPage),
  ]);
  if (!detail) notFound();
  return (
    <CheckoutPage
      completeAction={completeCheckoutAction}
      defaultPaymentDate={new Date().toISOString().slice(0, 16)}
      detail={detail}
      history={history}
      historyPage={historyPage}
      recordAction={recordPaymentAction}
    />
  );
}
