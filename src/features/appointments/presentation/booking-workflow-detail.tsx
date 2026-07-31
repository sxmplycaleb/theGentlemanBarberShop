import Link from "next/link";

import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/page-header";
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
    <AuthenticatedPageShell
      description="Review the booking and apply only the lifecycle transitions currently permitted."
      title="Appointment details"
    >
      <div className="grid max-w-4xl gap-8">
        <Card>
          <CardContent>
            <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Date" value={booking.booking_date} />
              <Detail
                label="Start time"
                value={booking.start_time.slice(0, 5)}
              />
              <Detail
                label="Customer"
                value={booking.customer?.full_name ?? "Unknown"}
              />
              <Detail
                label="Staff"
                value={booking.staff?.display_name ?? "Unknown"}
              />
              <Detail
                label="Service"
                value={booking.service?.name ?? "Unknown"}
              />
              <div>
                <dt className="text-muted-foreground text-sm">Status</dt>
                <dd className="mt-2">
                  <BookingStatusBadge
                    deletedAt={null}
                    status={booking.status}
                  />
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <section className="grid gap-4">
          <SectionHeader title="Available transitions" />
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
            <EmptyState
              description="This booking is in a terminal workflow state and has no further transitions."
              title="Workflow complete"
            />
          )}
        </section>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/account/appointments">Back to appointments</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/account/bookings/${booking.id}/edit`}>
              Edit booking
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/account/payments/checkout/${booking.id}`}>
              Payments
            </Link>
          </Button>
        </div>
      </div>
    </AuthenticatedPageShell>
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
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
