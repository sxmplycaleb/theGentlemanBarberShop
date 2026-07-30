import { beforeEach, describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({ protect: vi.fn() }));
const { revalidatePath } = vi.hoisted(() => ({ revalidatePath: vi.fn() }));
const repositories = vi.hoisted(() => ({
  createBooking: vi.fn(),
  restoreBooking: vi.fn(),
  setBookingStatus: vi.fn(),
  softDeleteBooking: vi.fn(),
  updateBooking: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: { protect } }));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/features/bookings/data/booking.repository", () => repositories);

import {
  createBookingAction,
  restoreBookingAction,
  setBookingStatusAction,
  softDeleteBookingAction,
  updateBookingAction,
} from "@/features/bookings/actions/booking.actions";
import type { ActionState } from "@/features/bookings/types/booking-management.types";

const initialState: ActionState = { success: false };
const bookingId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";

function bookingFormData(overrides: Record<string, string> = {}) {
  const values = {
    booking_date: "2026-08-10",
    customer_id: "c38d17bb-32a8-4ef3-95ca-d2d16ca9ea77",
    service_id: "3bbc8fb4-f88b-491a-84f4-463b9cda4279",
    staff_id: "c4651894-b328-4873-8ea9-66ca850bcf45",
    start_time: "09:30",
    status: "pending",
    ...overrides,
  };
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

function actionFormData(values: Record<string, string> = {}) {
  const formData = new FormData();
  formData.set("id", bookingId);
  Object.entries(values).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

describe("booking actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    protect.mockResolvedValue({ userId: "user_123" });
  });

  it("protects, validates, creates, and revalidates", async () => {
    await expect(
      createBookingAction(initialState, bookingFormData()),
    ).resolves.toEqual({ message: "Booking created.", success: true });
    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.createBooking).toHaveBeenCalledWith(
      expect.objectContaining({ booking_date: "2026-08-10" }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/account/bookings");
  });

  it("rejects invalid and unknown create input", async () => {
    const formData = bookingFormData({ booking_date: "" });
    formData.set("extra", "value");
    expect((await createBookingAction(initialState, formData)).success).toBe(
      false,
    );
    expect(repositories.createBooking).not.toHaveBeenCalled();
  });

  it("updates a valid booking and rejects invalid identifiers", async () => {
    await expect(
      updateBookingAction(bookingId, initialState, bookingFormData()),
    ).resolves.toEqual({ message: "Booking updated.", success: true });
    expect(repositories.updateBooking).toHaveBeenCalledWith(
      bookingId,
      expect.any(Object),
    );
    await expect(
      updateBookingAction("invalid", initialState, bookingFormData()),
    ).resolves.toEqual({ message: "Invalid booking.", success: false });
  });

  it("changes status, deletes, and restores", async () => {
    await expect(
      setBookingStatusAction(
        initialState,
        actionFormData({ status: "confirmed" }),
      ),
    ).resolves.toEqual({
      message: "Booking status updated.",
      success: true,
    });
    await expect(
      softDeleteBookingAction(initialState, actionFormData()),
    ).resolves.toEqual({ message: "Booking deleted.", success: true });
    await expect(
      restoreBookingAction(initialState, actionFormData()),
    ).resolves.toEqual({ message: "Booking restored.", success: true });
  });

  it("rejects invalid status, delete, and restore input", async () => {
    expect(
      (
        await setBookingStatusAction(
          initialState,
          actionFormData({ status: "invalid" }),
        )
      ).success,
    ).toBe(false);
    const invalid = new FormData();
    invalid.set("id", "invalid");
    expect((await softDeleteBookingAction(initialState, invalid)).success).toBe(
      false,
    );
    expect((await restoreBookingAction(initialState, invalid)).success).toBe(
      false,
    );
  });

  it.each([
    [
      "createBooking",
      () => createBookingAction(initialState, bookingFormData()),
    ],
    [
      "updateBooking",
      () => updateBookingAction(bookingId, initialState, bookingFormData()),
    ],
    [
      "setBookingStatus",
      () =>
        setBookingStatusAction(
          initialState,
          actionFormData({ status: "completed" }),
        ),
    ],
    [
      "softDeleteBooking",
      () => softDeleteBookingAction(initialState, actionFormData()),
    ],
    [
      "restoreBooking",
      () => restoreBookingAction(initialState, actionFormData()),
    ],
  ] as const)("returns safe %s failures", async (method, call) => {
    repositories[method].mockRejectedValueOnce(new Error("Safe failure."));
    await expect(call()).resolves.toEqual({
      message: "Safe failure.",
      success: false,
    });
  });
});
