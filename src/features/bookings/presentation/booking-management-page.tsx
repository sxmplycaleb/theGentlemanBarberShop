import { UserButton } from "@clerk/nextjs";
import { CalendarDays } from "lucide-react";

import { APP_NAME } from "@/constants/app";
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
    <main className="bg-background text-foreground min-h-dvh">
      <div className="mx-auto grid min-h-dvh w-full max-w-7xl gap-10 px-6 py-8 sm:px-10 lg:px-12">
        <header className="border-border flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-4">
            <span className="border-border bg-card grid size-11 place-items-center border">
              <CalendarDays aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-muted-foreground text-sm">{APP_NAME}</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold">
                Booking management
              </h1>
            </div>
          </div>
          <UserButton />
        </header>
        <BookingList
          filters={filters}
          options={options}
          result={result}
          searchParams={searchParams}
        />
      </div>
    </main>
  );
}
