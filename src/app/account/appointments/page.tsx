import { auth } from "@clerk/nextjs/server";

import { parseBookingWorkflowFilters } from "@/features/appointments/data/appointment-workflow-filters";
import {
  listBookingWorkflowOptions,
  listBookingWorkflowQueue,
} from "@/features/appointments/data/booking-workflow.repository";
import { resolveBusinessDate } from "@/features/appointments/data/business-date";
import { AppointmentWorkflowPage } from "@/features/appointments/presentation/appointment-workflow-page";
import type { BookingWorkflowSearchParams } from "@/features/appointments/types/booking-workflow.types";
import { DEFAULT_BUSINESS_SETTINGS } from "@/features/business-settings/constants/business-settings.constants";
import { getBusinessSettings } from "@/features/business-settings/data/business-settings.repository";

export default async function Page({
  searchParams,
}: {
  readonly searchParams: Promise<BookingWorkflowSearchParams>;
}) {
  await auth.protect();
  const [params, settings] = await Promise.all([
    searchParams,
    getBusinessSettings(),
  ]);
  const businessDate = resolveBusinessDate(
    settings?.timezone ?? DEFAULT_BUSINESS_SETTINGS.timezone,
  );
  const filters = parseBookingWorkflowFilters(params, businessDate);
  const [result, options] = await Promise.all([
    listBookingWorkflowQueue(filters, businessDate),
    listBookingWorkflowOptions(),
  ]);
  return (
    <AppointmentWorkflowPage
      businessDate={businessDate}
      filters={filters}
      options={options}
      result={result}
      searchParams={params}
    />
  );
}
