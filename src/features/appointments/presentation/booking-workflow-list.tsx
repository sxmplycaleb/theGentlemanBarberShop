import Link from "next/link";

import { Pagination } from "@/components/management/pagination";
import { Button } from "@/components/ui/button";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { transitionBookingStatusAction } from "@/features/appointments/actions/appointment-workflow.actions";
import { AppointmentWorkflowControls } from "@/features/appointments/presentation/appointment-workflow-controls";
import { BookingTransitionForm } from "@/features/appointments/presentation/booking-transition-form";
import type {
  BookingWorkflowFilters,
  BookingWorkflowOptions,
  BookingWorkflowResult,
  BookingWorkflowSearchParams,
} from "@/features/appointments/types/booking-workflow.types";
import { BookingStatusBadge } from "@/features/bookings/presentation/booking-status-badge";

function paramsFrom(input: BookingWorkflowSearchParams) {
  const params = new URLSearchParams();
  Object.entries(input).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (typeof value === "string" && value) params.set(key, value);
  });
  return params;
}

export function BookingWorkflowList({
  filters,
  options,
  result,
  searchParams,
}: {
  readonly filters: BookingWorkflowFilters;
  readonly options: BookingWorkflowOptions;
  readonly result: BookingWorkflowResult;
  readonly searchParams: BookingWorkflowSearchParams;
}) {
  return (
    <section className="grid gap-5">
      <AppointmentWorkflowControls filters={filters} options={options} />
      <ResponsiveTable label="Appointment workflow">
        <table className="data-table min-w-[68rem] text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.data.length ? (
              result.data.map((booking) => (
                <tr className="border-border border-t" key={booking.id}>
                  <td className="px-4 py-4 font-medium">
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
                      deletedAt={null}
                      status={booking.status}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline">
                        <Link href={`/account/appointments/${booking.id}`}>
                          Details
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
                      {booking.availableTransitions.map((target) => (
                        <BookingTransitionForm
                          action={transitionBookingStatusAction}
                          bookingId={booking.id}
                          expectedStatus={booking.status}
                          key={target}
                          targetStatus={target}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="text-muted-foreground px-4 py-8 text-center"
                  colSpan={6}
                >
                  No appointments match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ResponsiveTable>
      <Pagination
        pageParam="page"
        pagination={result.pagination}
        searchParams={paramsFrom(searchParams)}
      />
    </section>
  );
}
