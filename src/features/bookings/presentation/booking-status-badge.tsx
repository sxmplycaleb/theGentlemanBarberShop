import type { BookingStatus } from "@/features/bookings/types/booking-management.types";
import { Badge } from "@/components/ui/badge";

const labels: Record<BookingStatus, string> = {
  cancelled: "Cancelled",
  completed: "Completed",
  confirmed: "Confirmed",
  no_show: "No show",
  pending: "Pending",
};

const variants: Record<
  BookingStatus,
  "danger" | "info" | "neutral" | "success" | "warning"
> = {
  cancelled: "danger",
  completed: "success",
  confirmed: "info",
  no_show: "warning",
  pending: "neutral",
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
      <Badge variant={variants[status]}>{labels[status]}</Badge>
      {deletedAt ? <Badge variant="outline">Deleted</Badge> : null}
    </div>
  );
}
