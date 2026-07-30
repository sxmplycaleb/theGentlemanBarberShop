import type { BookingStatus } from "@/features/bookings/types/booking-management.types";

export const BOOKING_STATUS_TRANSITIONS = {
  cancelled: [],
  completed: [],
  confirmed: ["completed", "cancelled", "no_show"],
  no_show: [],
  pending: ["confirmed", "cancelled", "no_show"],
} as const satisfies Record<BookingStatus, readonly BookingStatus[]>;

export function isBookingStatusTransitionAllowed(
  currentStatus: BookingStatus,
  targetStatus: BookingStatus,
) {
  return (
    BOOKING_STATUS_TRANSITIONS[currentStatus] as readonly BookingStatus[]
  ).includes(targetStatus);
}

export function getAvailableBookingTransitions(
  status: BookingStatus,
  bookingDate: string,
  businessDate: string,
): readonly BookingStatus[] {
  return BOOKING_STATUS_TRANSITIONS[status].filter((target) => {
    if (target === "confirmed") {
      return bookingDate >= businessDate;
    }

    if (target === "completed" || target === "no_show") {
      return bookingDate <= businessDate;
    }

    return true;
  });
}
