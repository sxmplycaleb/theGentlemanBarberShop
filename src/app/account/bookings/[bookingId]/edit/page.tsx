import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { updateBookingAction } from "@/features/bookings/actions/booking.actions";
import {
  getBookingById,
  listBookingSelectionOptions,
} from "@/features/bookings/data/booking.repository";
import { BookingForm } from "@/features/bookings/presentation/booking-form";
import { BookingFormPage } from "@/features/bookings/presentation/booking-form-page";
import { bookingIdSchema } from "@/features/bookings/validation/booking.schema";

interface PageProps {
  readonly params: Promise<{ readonly bookingId: string }>;
}

export default async function Page({ params }: PageProps) {
  await auth.protect();
  const { bookingId } = await params;
  const parsed = bookingIdSchema.safeParse({ id: bookingId });

  if (!parsed.success) {
    notFound();
  }

  const booking = await getBookingById(parsed.data.id);

  if (!booking || booking.deleted_at) {
    notFound();
  }

  const options = await listBookingSelectionOptions({
    customerId: booking.customer_id,
    serviceId: booking.service_id,
    staffId: booking.staff_id,
  });

  return (
    <BookingFormPage title="Edit booking">
      <BookingForm
        action={updateBookingAction.bind(null, booking.id)}
        booking={{
          booking_date: booking.booking_date,
          customer_id: booking.customer_id,
          service_id: booking.service_id,
          staff_id: booking.staff_id,
          start_time: booking.start_time,
          status: booking.status,
        }}
        options={options}
        submitLabel="Update booking"
      />
    </BookingFormPage>
  );
}
