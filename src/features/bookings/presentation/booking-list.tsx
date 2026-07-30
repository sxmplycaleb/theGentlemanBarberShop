import Link from "next/link";

import { Pagination } from "@/components/management/pagination";
import { Button } from "@/components/ui/button";
import {
  restoreBookingAction,
  softDeleteBookingAction,
} from "@/features/bookings/actions/booking.actions";
import { BookingActionForm } from "@/features/bookings/presentation/booking-action-form";
import { BookingManagementControls } from "@/features/bookings/presentation/booking-management-controls";
import { BookingStatusBadge } from "@/features/bookings/presentation/booking-status-badge";
import type {
  BookingListFilters,
  BookingManagementSearchParams,
  BookingSelectionOptions,
  BookingWithRelations,
  PaginatedResult,
} from "@/features/bookings/types/booking-management.types";

interface BookingListProps {
  readonly filters: BookingListFilters;
  readonly options: BookingSelectionOptions;
  readonly result: PaginatedResult<BookingWithRelations>;
  readonly searchParams: BookingManagementSearchParams;
}

function toUrlSearchParams(searchParams: BookingManagementSearchParams) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (typeof value === "string" && value) {
      params.set(key, value);
    }
  });

  return params;
}

export function BookingList({
  filters,
  options,
  result,
  searchParams,
}: BookingListProps) {
  return (
    <section className="grid gap-5" id="bookings">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold">Bookings</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage customer bookings in the business timezone.
          </p>
        </div>
        <Button asChild>
          <Link href="/account/bookings/new">New booking</Link>
        </Button>
      </div>

      <BookingManagementControls filters={filters} options={options} />

      <div className="border-border overflow-x-auto border">
        <table className="w-full min-w-[72rem] border-collapse text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Start</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Staff</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.data.length ? (
              result.data.map((booking) => (
                <tr className="border-border border-t" key={booking.id}>
                  <td className="px-4 py-4 font-medium">
                    {booking.booking_date}
                  </td>
                  <td className="px-4 py-4">
                    {booking.start_time.slice(0, 5)}
                  </td>
                  <td className="px-4 py-4">
                    {booking.customer?.full_name ?? "Unknown"}
                  </td>
                  <td className="px-4 py-4">
                    {booking.staff?.display_name ?? "Unknown"}
                  </td>
                  <td className="px-4 py-4">
                    {booking.service?.name ?? "Unknown"}
                  </td>
                  <td className="px-4 py-4">
                    <BookingStatusBadge
                      deletedAt={booking.deleted_at}
                      status={booking.status}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      {booking.deleted_at ? (
                        <BookingActionForm
                          action={restoreBookingAction}
                          id={booking.id}
                        >
                          Restore
                        </BookingActionForm>
                      ) : (
                        <>
                          <Button asChild variant="outline">
                            <Link href={`/account/bookings/${booking.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                          <Button asChild variant="outline">
                            <Link href={`/account/appointments/${booking.id}`}>
                              Workflow
                            </Link>
                          </Button>
                          {booking.status !== "cancelled" ? (
                            <Button asChild variant="outline">
                              <Link
                                href={`/account/payments/checkout/${booking.id}`}
                              >
                                Checkout
                              </Link>
                            </Button>
                          ) : null}
                          <BookingActionForm
                            action={softDeleteBookingAction}
                            id={booking.id}
                          >
                            Delete
                          </BookingActionForm>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="text-muted-foreground px-4 py-8 text-center"
                  colSpan={7}
                >
                  No bookings match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        pageParam="page"
        pagination={result.pagination}
        searchParams={toUrlSearchParams(searchParams)}
      />
    </section>
  );
}
