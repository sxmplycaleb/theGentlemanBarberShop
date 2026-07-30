import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { getBookingWorkflowDetail } from "@/features/appointments/data/booking-workflow.repository";
import { resolveBusinessDate } from "@/features/appointments/data/business-date";
import { BookingWorkflowDetail } from "@/features/appointments/presentation/booking-workflow-detail";
import { bookingWorkflowIdSchema } from "@/features/appointments/validation/appointment-workflow.schema";
import { DEFAULT_BUSINESS_SETTINGS } from "@/features/business-settings/constants/business-settings.constants";
import { getBusinessSettings } from "@/features/business-settings/data/business-settings.repository";

export default async function Page({
  params,
}: {
  readonly params: Promise<{ readonly bookingId: string }>;
}) {
  await auth.protect();
  const [{ bookingId }, settings] = await Promise.all([
    params,
    getBusinessSettings(),
  ]);
  const parsed = bookingWorkflowIdSchema.safeParse({ id: bookingId });
  if (!parsed.success) notFound();
  const businessDate = resolveBusinessDate(
    settings?.timezone ?? DEFAULT_BUSINESS_SETTINGS.timezone,
  );
  const booking = await getBookingWorkflowDetail(parsed.data.id, businessDate);
  if (!booking) notFound();
  return <BookingWorkflowDetail booking={booking} />;
}
