import type { BookingStatus } from "@/features/bookings/types/booking-management.types";

const labels: Record<BookingStatus, string> = {
  cancelled: "Cancelled",
  completed: "Completed",
  confirmed: "Confirmed",
  no_show: "No show",
  pending: "Pending",
};

interface BookingStatusBadgeProps {
  readonly deletedAt: string | null;
  readonly status: BookingStatus;
}

export function BookingStatusBadge({
  deletedAt,
  status,
}: BookingStatusBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="border-border inline-flex min-h-7 items-center rounded-sm border px-2 text-xs">
        {labels[status]}
      </span>
      {deletedAt ? (
        <span className="border-border text-muted-foreground inline-flex min-h-7 items-center rounded-sm border px-2 text-xs">
          Deleted
        </span>
      ) : null}
    </div>
  );
}
