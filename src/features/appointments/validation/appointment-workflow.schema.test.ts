import { describe, expect, it } from "vitest";

import { bookingTransitionSchema } from "@/features/appointments/validation/appointment-workflow.schema";

const valid = {
  booking_id: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
  expected_status: "pending",
  target_status: "confirmed",
};

describe("appointment workflow schema", () => {
  it("accepts valid strict transition input", () => {
    expect(bookingTransitionSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid values and unknown fields", () => {
    expect(
      bookingTransitionSchema.safeParse({ ...valid, extra: true }).success,
    ).toBe(false);
    expect(
      bookingTransitionSchema.safeParse({ ...valid, booking_id: "bad" })
        .success,
    ).toBe(false);
    expect(
      bookingTransitionSchema.safeParse({
        ...valid,
        target_status: "checked_in",
      }).success,
    ).toBe(false);
  });
});
