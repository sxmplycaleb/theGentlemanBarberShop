import { describe, expect, it } from "vitest";

import {
  bookingFormSchema,
  bookingIdSchema,
  bookingStatusActionSchema,
} from "@/features/bookings/validation/booking.schema";

const ids = {
  customer_id: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
  service_id: "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77",
  staff_id: "3bbc8fb4-f88b-491a-84f4-463b9cda4279",
};

describe("booking validation", () => {
  it("accepts normalized booking values", () => {
    expect(
      bookingFormSchema.parse({
        ...ids,
        booking_date: " 2026-08-10 ",
        start_time: " 09:30 ",
        status: "confirmed",
      }),
    ).toEqual({
      ...ids,
      booking_date: "2026-08-10",
      start_time: "09:30",
      status: "confirmed",
    });
  });

  it.each([
    ["date format", { booking_date: "10/08/2026" }],
    ["calendar date", { booking_date: "2026-02-30" }],
    ["time", { start_time: "25:00" }],
    ["status", { status: "scheduled" }],
    ["customer", { customer_id: "invalid" }],
  ])("rejects invalid %s", (_name, override) => {
    expect(
      bookingFormSchema.safeParse({
        ...ids,
        booking_date: "2026-08-10",
        start_time: "09:30",
        status: "pending",
        ...override,
      }).success,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      bookingFormSchema.safeParse({
        ...ids,
        booking_date: "2026-08-10",
        role: "admin",
        start_time: "09:30",
        status: "pending",
      }).success,
    ).toBe(false);
  });

  it("validates identifiers and status actions strictly", () => {
    expect(bookingIdSchema.safeParse({ id: ids.customer_id }).success).toBe(
      true,
    );
    expect(
      bookingStatusActionSchema.safeParse({
        id: ids.customer_id,
        status: "no_show",
      }).success,
    ).toBe(true);
    expect(
      bookingStatusActionSchema.safeParse({
        extra: true,
        id: ids.customer_id,
        status: "pending",
      }).success,
    ).toBe(false);
  });
});
