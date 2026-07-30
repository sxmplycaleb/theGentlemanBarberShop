import { describe, expect, it } from "vitest";

import {
  BOOKING_STATUS_TRANSITIONS,
  getAvailableBookingTransitions,
  isBookingStatusTransitionAllowed,
} from "@/features/bookings/constants/booking-status-transitions";
import {
  BOOKING_STATUSES,
  type BookingStatus,
} from "@/features/bookings/types/booking-management.types";

describe("booking status transitions", () => {
  it("defines every allowed and terminal transition once", () => {
    expect(BOOKING_STATUS_TRANSITIONS).toEqual({
      cancelled: [],
      completed: [],
      confirmed: ["completed", "cancelled", "no_show"],
      no_show: [],
      pending: ["confirmed", "cancelled", "no_show"],
    });
    for (const current of BOOKING_STATUSES) {
      for (const target of BOOKING_STATUSES) {
        expect(isBookingStatusTransitionAllowed(current, target)).toBe(
          (
            BOOKING_STATUS_TRANSITIONS[current] as readonly BookingStatus[]
          ).includes(target),
        );
      }
    }
  });

  it("applies business-date restrictions", () => {
    expect(
      getAvailableBookingTransitions("pending", "2026-08-11", "2026-08-10"),
    ).toEqual(["confirmed", "cancelled"]);
    expect(
      getAvailableBookingTransitions("pending", "2026-08-09", "2026-08-10"),
    ).toEqual(["cancelled", "no_show"]);
    expect(
      getAvailableBookingTransitions("confirmed", "2026-08-11", "2026-08-10"),
    ).toEqual(["cancelled"]);
    expect(
      getAvailableBookingTransitions("completed", "2026-08-10", "2026-08-10"),
    ).toEqual([]);
    expect(
      getAvailableBookingTransitions("cancelled", "2026-08-10", "2026-08-10"),
    ).toEqual([]);
    expect(
      getAvailableBookingTransitions("no_show", "2026-08-10", "2026-08-10"),
    ).toEqual([]);
  });
});
