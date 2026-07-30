import Link from "next/link";

import { Button } from "@/components/ui/button";
import { transitionBookingStatusAction } from "@/features/appointments/actions/appointment-workflow.actions";
import { BookingTransitionForm } from "@/features/appointments/presentation/booking-transition-form";
import type { BookingWorkflowProjection } from "@/features/appointments/types/booking-workflow.types";
import { BookingStatusBadge } from "@/features/bookings/presentation/booking-status-badge";

export function BookingWorkflowDetail({
  booking,
}: {
  readonly booking: BookingWorkflowProjection;
}) {
  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-3xl content-start gap-8 px-6 py-8">
      <div>
        <p className="text-muted-foreground text-sm">Booking workflow</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold">
          Appointment details
        </h1>
      </div>
      <dl className="border-border grid gap-5 border p-6 sm:grid-cols-2">
        <Detail label="Date" value={booking.booking_date} />
        <Detail label="Start time" value={booking.start_time.slice(0, 5)} />
        <Detail
          label="Customer"
          value={booking.customer?.full_name ?? "Unknown"}
        />
        <Detail
          label="Staff"
          value={booking.staff?.display_name ?? "Unknown"}
        />
        <Detail label="Service" value={booking.service?.name ?? "Unknown"} />
        <div>
          <dt className="text-muted-foreground text-sm">Status</dt>
          <dd className="mt-2">
            <BookingStatusBadge deletedAt={null} status={booking.status} />
          </dd>
        </div>
      </dl>
      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">Available transitions</h2>
        {booking.availableTransitions.length ? (
          <div className="flex flex-wrap gap-3">
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
        ) : (
          <p className="text-muted-foreground text-sm">
            This booking is in a terminal workflow state.
          </p>
        )}
      </section>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/account/appointments">Back to appointments</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/account/bookings/${booking.id}/edit`}>
            Edit booking
          </Link>
        </Button>
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div>
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
