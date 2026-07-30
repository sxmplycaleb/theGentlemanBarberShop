import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { recordRefundAction } from "@/features/payments/actions/payment.actions";
import { getPaymentDetail } from "@/features/payments/data/payment.repository";
import { PaymentDetail } from "@/features/payments/presentation/payment-detail";
import { paymentIdSchema } from "@/features/payments/validation/payment.schema";

export default async function Page({
  params,
}: {
  readonly params: Promise<{ readonly paymentId: string }>;
}) {
  await auth.protect();
  const { paymentId } = await params;
  const parsed = paymentIdSchema.safeParse({ id: paymentId });
  if (!parsed.success) notFound();
  const detail = await getPaymentDetail(parsed.data.id);
  if (!detail) notFound();
  return (
    <PaymentDetail
      defaultPaymentDate={new Date().toISOString().slice(0, 16)}
      detail={detail}
      refundAction={recordRefundAction}
    />
  );
}
