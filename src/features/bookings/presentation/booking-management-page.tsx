import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { BookingList } from "@/features/bookings/presentation/booking-list";
import type {
  BookingListFilters,
  BookingManagementSearchParams,
  BookingSelectionOptions,
  BookingWithRelations,
  PaginatedResult,
} from "@/features/bookings/types/booking-management.types";

interface BookingManagementPageProps {
  readonly filters: BookingListFilters;
  readonly options: BookingSelectionOptions;
  readonly result: PaginatedResult<BookingWithRelations>;
  readonly searchParams: BookingManagementSearchParams;
}

export function BookingManagementPage({
  filters,
  options,
  result,
  searchParams,
}: BookingManagementPageProps) {
  return (
    <AuthenticatedPageShell
      description="Schedule and manage customer bookings without changing the appointment workflow."
      title="Booking management"
    >
      <BookingList
        filters={filters}
        options={options}
        result={result}
        searchParams={searchParams}
      />
    </AuthenticatedPageShell>
  );
}
