import { auth } from "@clerk/nextjs/server";

import { parseBookingListFilters } from "@/features/bookings/data/booking-management-filters";
import {
  listBookings,
  listBookingSelectionOptions,
} from "@/features/bookings/data/booking.repository";
import { BookingManagementPage } from "@/features/bookings/presentation/booking-management-page";
import type { BookingManagementSearchParams } from "@/features/bookings/types/booking-management.types";

interface PageProps {
  readonly searchParams: Promise<BookingManagementSearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  await auth.protect();
  const resolvedSearchParams = await searchParams;
  const filters = parseBookingListFilters(resolvedSearchParams);
  const [result, options] = await Promise.all([
    listBookings(filters),
    listBookingSelectionOptions(),
  ]);

  return (
    <BookingManagementPage
      filters={filters}
      options={options}
      result={result}
      searchParams={resolvedSearchParams}
    />
  );
}
